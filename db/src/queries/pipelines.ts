import { eq } from "drizzle-orm";
import { db } from "../index.js";
import {
  Action,
  actions,
  Pipeline,
  pipelines,
  pipelines_actions,
  pipelines_subscribers,
  Source,
  sources,
  SubScriber,
  subscribers,
} from "../schema.js";

export const createPipeline = async (pipeline: Pipeline) => {
  const [result] = await db.insert(pipelines).values(pipeline).returning();
  return result;
};

export const getPipelines = async () => {
  const rows = await db
    .select({
      pipelineId: pipelines.id,
      pipelineName: pipelines.name,

      sourceId: sources.id,
      sourceName: sources.name,
      sourceUrl: sources.url,
      sourceAddress: sources.address,

      subscriberId: subscribers.id,
      subscriberName: subscribers.name,
      subscriberUrl: subscribers.url,

      actionId: actions.id,
      actionName: actions.type,
      actionEditable: actions.editable,
      actionRequired: actions.required,
      actionDescription: actions.description,
      actionOrder: actions.order,
      actionConfig: actions.config,
    })
    .from(pipelines)
    .innerJoin(sources, eq(pipelines.sourceId, sources.id))

    .leftJoin(
      pipelines_subscribers,
      eq(pipelines.id, pipelines_subscribers.pipelineId),
    )
    .leftJoin(
      subscribers,
      eq(pipelines_subscribers.subscriberId, subscribers.id),
    )

    .leftJoin(pipelines_actions, eq(pipelines.id, pipelines_actions.pipelineId))
    .leftJoin(actions, eq(pipelines_actions.actionId, actions.id));

  if (rows.length === 0) return [];

  const pipelinesMap = new Map();

  for (const row of rows) {
    if (!pipelinesMap.has(row.pipelineId)) {
      pipelinesMap.set(row.pipelineId, {
        id: row.pipelineId,
        name: row.pipelineName,
        source: {
          id: row.sourceId,
          name: row.sourceName,
          url: row.sourceUrl,
          address: row.sourceAddress,
        },
        subscribers: [],
        actions: [],
      });
    }

    const pipeline = pipelinesMap.get(row.pipelineId);

    if (
      row.subscriberId &&
      !pipeline.subscribers.some((s: SubScriber) => s.id === row.subscriberId)
    ) {
      pipeline.subscribers.push({
        id: row.subscriberId,
        name: row.subscriberName,
        url: row.subscriberUrl,
      });
    }

    if (
      row.actionId &&
      !pipeline.actions.some((a: Action) => a.id === row.actionId)
    ) {
      pipeline.actions.push({
        id: row.actionId,
        name: row.actionName,
        editable: row.actionEditable,
        required: row.actionRequired,
        description: row.actionDescription,
        order: row.actionOrder,
        config: row.actionConfig,
      });
    }
  }

  return Array.from(pipelinesMap.values()).map((pipeline) => ({
    ...pipeline,
    actions: pipeline.actions.sort((a: Action, b: Action) => a.order - b.order),
  }));
};

export const getPipelineByID = async (pipelineId: string) => {
  const rows = await db
    .select({
      pipelineId: pipelines.id,
      pipelineName: pipelines.name,

      sourceId: sources.id,
      sourceName: sources.name,
      sourceUrl: sources.url,
      sourceAddress: sources.address,

      subscriberId: subscribers.id,
      subscriberName: subscribers.name,
      subscriberUrl: subscribers.url,

      actionId: actions.id,
      actionName: actions.type,
      actionEditable: actions.editable,
      actionRequired: actions.required,
      actionDescription: actions.description,
      actionOrder: actions.order,
      actionConfig: actions.config,
    })
    .from(pipelines)
    .innerJoin(sources, eq(pipelines.sourceId, sources.id))

    .leftJoin(
      pipelines_subscribers,
      eq(pipelines.id, pipelines_subscribers.pipelineId),
    )
    .leftJoin(
      subscribers,
      eq(pipelines_subscribers.subscriberId, subscribers.id),
    )

    .leftJoin(pipelines_actions, eq(pipelines.id, pipelines_actions.pipelineId))
    .leftJoin(actions, eq(pipelines_actions.actionId, actions.id))

    .where(eq(pipelines.id, pipelineId));

  if (rows.length === 0) return null;

  const pipeline: {
    id: string;
    name: string;
    source: Source;
    subscribers: SubScriber[];
    actions: Action[];
  } = {
    id: rows[0].pipelineId,
    name: rows[0].pipelineName,
    source: {
      id: rows[0].sourceId,
      name: rows[0].sourceName,
      url: rows[0].sourceUrl,
      address: rows[0].sourceAddress,
    },
    subscribers: [],
    actions: [],
  };

  for (const row of rows) {
    if (
      row.subscriberId &&
      !pipeline.subscribers.some((s) => s.id === row.subscriberId)
    ) {
      pipeline.subscribers.push({
        id: row.subscriberId,
        name: row.subscriberName!,
        url: row.subscriberUrl!,
      });
    }

    if (
      row.actionId &&
      !pipeline.actions.some((a: Action) => a.id === row.actionId)
    ) {
      pipeline.actions.push({
        id: row.actionId,
        type: row.actionName!,
        editable: row.actionEditable,
        required: row.actionRequired,
        description: row.actionDescription!,
        order: row.actionOrder!,
        config: row.actionConfig,
      });
    }
  }

  pipeline.actions.sort((a: Action, b: Action) => a.order - b.order);

  return pipeline;
};

export const deletePipeline = async (pipelineId: string) => {
  await db.delete(pipelines).where(eq(pipelines.id, pipelineId));
};

export const getPipelineBySourceID = async (sourceId: string) => {
  const [result] = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.sourceId, sourceId));
  return result;
};

export const updatePipelineStatus = async (
  pipelineId: string,
  pipeline: Pipeline,
) => {
  await db.update(pipelines).set(pipeline).where(eq(pipelines.id, pipelineId));
};
