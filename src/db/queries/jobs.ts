import { db } from "../index.js";
import { Job, jobs } from "../schema.js";

export async function createJob(job: Job) {
  const [result] = await db.insert(jobs).values(job).returning();
  return result;
}
