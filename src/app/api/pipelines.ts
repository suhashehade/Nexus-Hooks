import { NextFunction, Request, Response } from "express";
import {
  createPipeline,
  deletePipeline,
  getPipelineByID,
  getPipelines,
} from "../../db/queries/pipelines.js";
import { getSourceByID } from "../../db/queries/sources.js";
import { NotFoundError } from "../../lib/classes/errors.js";

export const addPipelineHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const source = await getSourceByID(req.body.sourceId);
    if (!source) {
      throw new NotFoundError("Source Not Found!");
    }
    const response = await createPipeline(req.body);
    res.status(201).json({
      id: response.id,
      name: response.name,
      source: source,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAllPipelinesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pipelines = await getPipelines();
    res.status(200).json(pipelines);
  } catch (error: any) {
    next(error);
  }
};

export const getPipelineByIDHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pipelineId: string = req.params.pipelineId.toString();
    const pipeline = await getPipelineByID(pipelineId);
    if (!pipeline) {
      throw new NotFoundError("Pipeline Not Found");
    }
    const source = await getSourceByID(pipeline.sourceId);
    if (!source) {
      throw new NotFoundError("Source Not Found");
    }
    res
      .status(200)
      .json({ id: pipeline.id, name: pipeline.name, source: source });
  } catch (error: any) {
    next(error);
  }
};

export const deletePipelineHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pipelineId: string = req.params.pipelineId.toString();
    const pipeline = await getPipelineByID(pipelineId);
    if (!pipeline) {
      throw new NotFoundError("Pipeline Not Found");
    }
    await deletePipeline(pipelineId);
    res.status(200).json({ id: req.params.pipelineId });
  } catch (error: any) {
    next(error);
  }
};
