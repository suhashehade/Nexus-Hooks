import { NextFunction, Request, Response } from "express";
import { getSourceByURL } from "db";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../lib/classes/errors.js";
import { getPipelineBySourceID } from "db";
import { createJob } from "db";
import { generateJobName } from "../utils/generateJobName.js";

export const webhookIngestionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { event, payload } = req.body;
    if (event !== "order-complete") {
      throw new ForbiddenError(
        "This operation is not allowed, the order is not completed",
      );
    }

    const APIKey = req.get("X-API-Key");
    if (!APIKey) {
      throw new BadRequestError("API KEY secret is required");
    }
    const fullURL = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const source = await getSourceByURL(fullURL);
    if (!source) {
      throw new NotFoundError(`Source not found: ${fullURL}`);
    }
    const pipeline = await getPipelineBySourceID(source.id);

    if (!pipeline) {
      throw new NotFoundError("Pipeline not found");
    }

    if (APIKey !== pipeline.secret) {
      throw new BadRequestError("Invalid secret");
    }
    const newJob = {
      pipelineId: pipeline.id,
      payload,
      name: generateJobName(),
    };
    const job = await createJob(newJob);
    res.status(202).json({ message: "The job is accepted", job, code: 202 });
  } catch (error: any) {
    next(error);
  }
};
