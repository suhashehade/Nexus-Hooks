import { createPipeline, deletePipeline, getPipelineByID, getPipelines, } from "../db/queries/pipelines.js";
import { getSourceByID } from "../db/queries/sources.js";
import { NotFoundError } from "../lib/classes/errors.js";
import { createPipelineSubscriber } from "../db/queries/pipelinesSubscribers.js";
export const addPipelineHandler = async (req, res, next) => {
    try {
        const { sourceId, subscribers } = req.body;
        const source = await getSourceByID(sourceId);
        if (!source) {
            throw new NotFoundError("Source Not Found!");
        }
        const pipeline = await createPipeline(req.body);
        for (const subscriberId of subscribers) {
            await createPipelineSubscriber(pipeline.id, subscriberId);
        }
        const fullPipeline = await getPipelineByID(pipeline.id);
        res.status(201).json({
            id: pipeline.id,
            name: pipeline.name,
            source,
            subscribers: fullPipeline?.subscribers ?? [],
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAllPipelinesHandler = async (req, res, next) => {
    try {
        const pipelines = await getPipelines();
        res.status(200).json(pipelines);
    }
    catch (error) {
        next(error);
    }
};
export const getPipelineByIDHandler = async (req, res, next) => {
    try {
        const pipelineId = req.params.pipelineId.toString();
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
    }
    catch (error) {
        next(error);
    }
};
export const deletePipelineHandler = async (req, res, next) => {
    try {
        const pipelineId = req.params.pipelineId.toString();
        const pipeline = await getPipelineByID(pipelineId);
        if (!pipeline) {
            throw new NotFoundError("Pipeline Not Found");
        }
        await deletePipeline(pipelineId);
        res.status(200).json({ id: req.params.pipelineId });
    }
    catch (error) {
        next(error);
    }
};
