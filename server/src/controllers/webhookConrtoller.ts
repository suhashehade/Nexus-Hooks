import { NextFunction, Request, Response } from "express";

import {
  BadRequestError,
  ForbiddenError,
  UnAuthorizedError,
} from "../lib/classes/errors.js";
import { getPipelineByID, getPipelineBySecret } from "db";
import { createJob } from "db";
import { generateRandomName } from "../utils/generateRandomName.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("server");

export const webhookIngestionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { event, payload, pipelineId } = req.body;
    logger.info("📥 Webhook received", {
      event,
      payload: JSON.stringify(payload).substring(0, 100),
    });

    if (event !== "order-complete") {
      throw new ForbiddenError("Invalid webhook signature");
    }

    const APIKey = req.get("X-API-Key");

    if (!pipelineId) {
      throw new BadRequestError("pipeline is required");
    }
    const pipeline = await getPipelineByID(pipelineId);

    if (!APIKey || pipeline.secret !== APIKey) {
      throw new UnAuthorizedError("Invalid secret");
    }

    logger.debug("🔍 Looking up pipeline by secret", {
      apiKey: APIKey.substring(0, 8) + "...",
    });

    logger.success("✅ Pipeline found", { pipelineName: pipeline.name });

    const newJob = {
      pipelineId: pipeline.id,
      payload,
      name: generateRandomName("job"),
    };

    const job = await createJob(newJob);

    logger.info("🎯 Job Queued", {
      jobName: job.name,
      pipelineName: pipeline.name,
    });

    res.status(202).json({ message: "The job is accepted", job, code: 202 });
  } catch (error: any) {
    logger.error("❌ Webhook processing failed", { error: error.message });
    next(error);
  }
};
