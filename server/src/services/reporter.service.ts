import { prisma } from "../db.js";
import { AppError } from "../middleware/error-handler.js";

export const reporterService = {
  async list() {
    return prisma.reporter.findMany();
  },

  async create(data: { name: string; location: string; ratePerMinute: number }) {
    return prisma.reporter.create({ data });
  },

  async getById(id: number) {
    const reporter = await prisma.reporter.findUnique({ where: { id } });
    if (!reporter) throw new AppError("Reporter not found", 404);
    return reporter;
  },
};
