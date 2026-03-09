import { db } from "../index.js";
import { jobs } from "../schema.js";
export async function createJob(job) {
    const [result] = await db.insert(jobs).values(job).returning();
    return result;
}
