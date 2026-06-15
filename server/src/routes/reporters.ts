import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { reporterService } from "../services/reporter.service.js";

export const reporterRouter = Router();

const createSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  ratePerMinute: z.number().int().positive(),
});

reporterRouter.get("/", async (_req, res, next) => {
  try {
    const data = await reporterService.list();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

reporterRouter.post("/", validate(createSchema), async (req, res, next) => {
  try {
    const data = await reporterService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

reporterRouter.get("/:id", async (req, res, next) => {
  try {
    const data = await reporterService.getById(parseInt(req.params.id));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});
