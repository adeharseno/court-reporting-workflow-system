import { prisma } from "../db.js";
import { AppError } from "../middleware/error-handler.js";

export const editorService = {
  async list() {
    return prisma.editor.findMany();
  },

  async create(data: { name: string; flatFee: number }) {
    return prisma.editor.create({ data });
  },

  async getById(id: number) {
    const editor = await prisma.editor.findUnique({ where: { id } });
    if (!editor) throw new AppError("Editor not found", 404);
    return editor;
  },
};
