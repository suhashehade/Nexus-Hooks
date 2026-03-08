import { eq } from "drizzle-orm";
import { db } from "../index.js";
import {
  Pipeline,
  pipelines,
  pipelines_subscribers,
  sources,
  subscribers,
} from "../schema.js";

export async function createPipeline(pipeline: Pipeline) {
  const [result] = await db.insert(pipelines).values(pipeline).returning();
  return result;
}

export async function getPipelines() {
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
    );

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
      });
    }

    if (row.subscriberId) {
      pipelinesMap.get(row.pipelineId).subscribers.push({
        id: row.subscriberId,
        name: row.subscriberName,
        url: row.subscriberUrl,
      });
    }
  }

  return Array.from(pipelinesMap.values());
}

export async function getPipelineByID(pipelineId: string) {
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
    .where(eq(pipelines.id, pipelineId));

  if (rows.length === 0) return null;

  const pipeline = {
    id: rows[0].pipelineId,
    name: rows[0].pipelineName,
    source: {
      id: rows[0].sourceId,
      name: rows[0].sourceName,
      url: rows[0].sourceUrl,
      address: rows[0].sourceAddress,
    },
    subscribers: rows
      .filter((r) => r.subscriberId)
      .map((r) => ({
        id: r.subscriberId,
        name: r.subscriberName,
        url: r.subscriberUrl,
      })),
  };

  return pipeline;
}

export async function deletePipeline(pipelineId: string) {
  await db.delete(pipelines).where(eq(pipelines.id, pipelineId));
}

export async function updatePipelineStatus(
  pipelineId: string,
  pipeline: Pipeline,
) {
  await db.update(pipelines).set(pipeline).where(eq(pipelines.id, pipelineId));
}
