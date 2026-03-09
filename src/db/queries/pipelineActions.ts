import { db } from "../index.js";
import { pipelines_actions } from "../schema.js";

export const createPipelineAction = async (
  pipelineId: string,
  actionId: string,
) => {
  const [result] = await db
    .insert(pipelines_actions)
    .values({ pipelineId, actionId })
    .returning();
  return result;
};
