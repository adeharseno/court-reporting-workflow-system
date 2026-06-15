import express from "express";
import cors from "cors";
import { reporterRouter } from "./routes/reporters.js";
import { editorRouter } from "./routes/editors.js";
import { jobRouter } from "./routes/jobs.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/v1/reporters", reporterRouter);
  app.use("/api/v1/editors", editorRouter);
  app.use("/api/v1/jobs", jobRouter);

  app.use(errorHandler);

  return app;
}
