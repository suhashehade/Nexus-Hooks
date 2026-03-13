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

    .orderBy(pipelines.id, actions.order);

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
    actions: pipeline.actions,
  }));
};

export const getPipelineByID = async (pipelineId: string) => {
  const rows = await db
    .select({
      pipelineId: pipelines.id,
      pipelineName: pipelines.name,

      sourceId: sources.id,
      sourceName: sources.name,

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
    .where(eq(pipelines.id, pipelineId))
    .orderBy(actions.order);

  if (rows.length === 0) return null;

  // نسخ نفس منطق getPipelines لكن لواحد فقط
  const pipelineMap = new Map<string, any>();
  for (const row of rows) {
    if (!pipelineMap.has(row.pipelineId)) {
      pipelineMap.set(row.pipelineId, {
        id: row.pipelineId,
        name: row.pipelineName,
        source: {
          id: row.sourceId,
          name: row.sourceName,
        },
        subscribers: [],
        actions: [],
      });
    }

    const pipeline = pipelineMap.get(row.pipelineId);

    if (
      row.subscriberId &&
      !pipeline.subscribers.some((s: any) => s.id === row.subscriberId)
    ) {
      pipeline.subscribers.push({
        id: row.subscriberId,
        name: row.subscriberName,
        url: row.subscriberUrl,
      });
    }

    if (
      row.actionId &&
      !pipeline.actions.some((a: any) => a.id === row.actionId)
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

  return pipelineMap.get(pipelineId);
};

export const deletePipeline = async (pipelineId: string) => {
  await db.delete(pipelines).where(eq(pipelines.id, pipelineId));
};

export const getPipelineBySecret = async (sectet: string) => {
  const [result] = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.secret, sectet));
  return result;
};

export const updatePipelineStatus = async (
  pipelineId: string,
  pipeline: Pipeline,
) => {
  await db.update(pipelines).set(pipeline).where(eq(pipelines.id, pipelineId));
};
