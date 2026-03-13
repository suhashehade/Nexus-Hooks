import { NextFunction, Request, Response } from "express";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../lib/classes/errors.js";
import { getPipelineBySecret } from "db";
import { createJob } from "db";
import { generateRandomName } from "../utils/generateRandomName.js";

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

    const pipeline = await getPipelineBySecret(APIKey);

    if (!pipeline) {
      throw new BadRequestError("Invalid secret");
    }

    const newJob = {
      pipelineId: pipeline.id,
      payload,
      name: generateRandomName("job"),
    };
    const job = await createJob(newJob);
    res.status(202).json({ message: "The job is accepted", job, code: 202 });
  } catch (error: any) {
    next(error);
  }
};
