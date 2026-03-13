import { getJobDetails, getJobsByPipelineId } from "db";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../lib/classes/errors.js";

export const getJobDetailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jobId: string = req.params.jobId.toString();
    const job = await getJobDetails(jobId);
    if (!job) {
      throw new NotFoundError("Job Not Found");
    }

    res.status(200).json(job);
  } catch (error: any) {
    next(error);
  }
};

export const getJobsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pipelineId = req.query!.pipelineId?.toString();

    const jobs = await getJobsByPipelineId(pipelineId!);

    res.status(200).json(jobs);
  } catch (error: any) {
    next(error);
  }
};
