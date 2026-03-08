import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { pipelines } from "../schema.js";
export async function createPipeline(pipeline) {
    const [result] = await db.insert(pipelines).values(pipeline).returning();
    return result;
}
export async function getPipelines() {
    const result = await db.select().from(pipelines);
    return result;
}
export async function getPipelineByID(pipelineId) {
    const [result] = await db
        .select()
        .from(pipelines)
        .where(eq(pipelines.id, pipelineId));
    return result;
}
export async function deletePipeline(pipelineId) {
    await db.delete(pipelines).where(eq(pipelines.id, pipelineId));
}
