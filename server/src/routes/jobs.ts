import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { jobService } from "../services/job.service.js";

export const jobRouter = Router();

const createJobSchema = z.object({
  caseName: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  location: z.string().min(1),
  locationType: z.enum(["physical", "remote"]),
});

const assignReporterSchema = z.object({
  reporterId: z.number().int().positive(),
});

const assignEditorSchema = z.object({
  editorId: z.number().int().positive(),
});

const updateStatusSchema = z.object({
  status: z.enum(["NEW", "ASSIGNED", "TRANSCRIBED", "REVIEWED", "COMPLETED"]),
});

jobRouter.post("/", validate(createJobSchema), async (req, res, next) => {
  try {
    const data = await jobService.createJob(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

jobRouter.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await jobService.listJobs(page, limit);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

jobRouter.get("/:id", async (req, res, next) => {
  try {
    const data = await jobService.getJob(parseInt(req.params.id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

jobRouter.post(
  "/:id/assign-reporter",
  validate(assignReporterSchema),
  async (req, res, next) => {
    try {
      const data = await jobService.assignReporter(
        parseInt(req.params.id),
        req.body.reporterId,
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
);

jobRouter.post(
  "/:id/assign-editor",
  validate(assignEditorSchema),
  async (req, res, next) => {
    try {
      const data = await jobService.assignEditor(
        parseInt(req.params.id),
        req.body.editorId,
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
);

jobRouter.patch(
  "/:id/status",
  validate(updateStatusSchema),
  async (req, res, next) => {
    try {
      const data = await jobService.updateStatus(
        parseInt(req.params.id),
        req.body.status,
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
);

jobRouter.get("/:id/payment", async (req, res, next) => {
  try {
    const data = await jobService.getPayment(parseInt(req.params.id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});
