import { db } from "../index.js";
import { pipelines_actions } from "../schema.js";
export async function createPipelineAction(pipelineId, actionId) {
    const [result] = await db
        .insert(pipelines_actions)
        .values({ pipelineId, actionId })
        .returning();
    return result;
}
