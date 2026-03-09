import { db } from "../index.js";
import { pipelines_subscribers } from "../schema.js";

export const createPipelineSubscriber = async (
  pipelineId: string,
  subscriberId: string,
) => {
  const [result] = await db
    .insert(pipelines_subscribers)
    .values({ pipelineId, subscriberId })
    .returning();
  return result;
};
