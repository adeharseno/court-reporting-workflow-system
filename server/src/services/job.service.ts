import { prisma } from "../db.js";
import { AppError } from "../middleware/error-handler.js";
import type { JobStatus } from "@prisma/client";

const VALID_TRANSITIONS: Record<JobStatus, JobStatus | null> = {
  NEW: "ASSIGNED",
  ASSIGNED: "TRANSCRIBED",
  TRANSCRIBED: "REVIEWED",
  REVIEWED: "COMPLETED",
  COMPLETED: null,
};

export const jobService = {
  async createJob(data: {
    caseName: string;
    durationMinutes: number;
    location: string;
    locationType: "physical" | "remote";
  }) {
    return prisma.job.create({ data });
  },

  async listJobs(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        include: { reporter: true, editor: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.count(),
    ]);
    return { data, meta: { page, limit, total } };
  },

  async getJob(id: number) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: { reporter: true, editor: true },
    });
    if (!job) throw new AppError("Job not found", 404);
    return job;
  },

  async assignReporter(jobId: number, reporterId: number) {
    const [job, reporter] = await Promise.all([
      prisma.job.findUnique({ where: { id: jobId } }),
      prisma.reporter.findUnique({ where: { id: reporterId } }),
    ]);

    if (!job) throw new AppError("Job not found", 404);
    if (!reporter) throw new AppError("Reporter not found", 404);

    if (job.status !== "NEW") {
      throw new AppError("Reporter can only be assigned to NEW jobs", 422);
    }
    if (!reporter.availability) {
      throw new AppError("Reporter is not available", 422);
    }
    if (
      job.locationType === "physical" &&
      reporter.location !== job.location
    ) {
      throw new AppError(
        "Reporter must be in the same location for physical jobs",
        422,
      );
    }

    return prisma.job.update({
      where: { id: jobId },
      data: { reporterId, status: "ASSIGNED" },
      include: { reporter: true, editor: true },
    });
  },

  async assignEditor(jobId: number, editorId: number) {
    const [job, editor] = await Promise.all([
      prisma.job.findUnique({ where: { id: jobId } }),
      prisma.editor.findUnique({ where: { id: editorId } }),
    ]);

    if (!job) throw new AppError("Job not found", 404);
    if (!editor) throw new AppError("Editor not found", 404);

    if (!job.reporterId) {
      throw new AppError(
        "A reporter must be assigned before an editor",
        422,
      );
    }

    return prisma.job.update({
      where: { id: jobId },
      data: { editorId },
      include: { reporter: true, editor: true },
    });
  },

  async updateStatus(jobId: number, status: JobStatus) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new AppError("Job not found", 404);

    const validNext = VALID_TRANSITIONS[job.status];
    if (validNext !== status) {
      throw new AppError(
        `Invalid status transition from ${job.status} to ${status}`,
        422,
      );
    }

    return prisma.job.update({
      where: { id: jobId },
      data: { status },
      include: { reporter: true, editor: true },
    });
  },

  async getPayment(jobId: number) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { reporter: true, editor: true },
    });
    if (!job) throw new AppError("Job not found", 404);

    const reporterPayment =
      job.durationMinutes * (job.reporter?.ratePerMinute ?? 0);
    const editorPayment = job.editor?.flatFee ?? 0;

    return {
      reporterPayment,
      editorPayment,
      totalPayout: reporterPayment + editorPayment,
    };
  },
};
