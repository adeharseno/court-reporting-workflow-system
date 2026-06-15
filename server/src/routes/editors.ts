import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { editorService } from "../services/editor.service.js";

export const editorRouter = Router();

const createSchema = z.object({
  name: z.string().min(1),
  flatFee: z.number().int().positive(),
});

editorRouter.get("/", async (_req, res, next) => {
  try {
    const data = await editorService.list();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

editorRouter.post("/", validate(createSchema), async (req, res, next) => {
  try {
    const data = await editorService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

editorRouter.get("/:id", async (req, res, next) => {
  try {
    const data = await editorService.getById(parseInt(req.params.id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});
