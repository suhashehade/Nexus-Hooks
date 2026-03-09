import { NextFunction, Request, Response } from "express";
import {
  createPipeline,
  deletePipeline,
  getPipelineByID,
  getPipelines,
} from "db";
import { getSourceByID } from "db";
import { NotFoundError } from "../lib/classes/errors.js";
import { createPipelineSubscriber } from "db";
import { createPipelineAction } from "db";
import { generatePipelineSecret } from "../utils/generatePipelineSecret.js";

export const addPipelineHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sourceId, subscribers, actions } = req.body;

    const source = await getSourceByID(sourceId);
    if (!source) {
      throw new NotFoundError("Source Not Found!");
    }
    const secret = generatePipelineSecret();
    const pipeline = await createPipeline({
      sourceId: req.body.sourceId,
      name: req.body.name,
      secret,
    });

    for (const subscriberId of subscribers) {
      await createPipelineSubscriber(pipeline.id, subscriberId);
    }

    for (const actionId of actions) {
      await createPipelineAction(pipeline.id, actionId);
    }

    const fullPipeline = await getPipelineByID(pipeline.id);

    res.status(201).json({
      id: pipeline.id,
      name: pipeline.name,
      source,
      subscribers: fullPipeline?.subscribers ?? [],
      actions: fullPipeline?.actions ?? [],
    });
  } catch (error) {
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

    res.status(200).json({
      id: pipeline.id,
      name: pipeline.name,
      source: pipeline.source,
      subscribers: pipeline.subscribers,
    });
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
