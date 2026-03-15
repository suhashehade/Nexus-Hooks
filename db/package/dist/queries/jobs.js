import { db } from "../index.js";
import { jobs } from "../schema.js";
export const createJob = async (job) => {
  const [result] = await db.insert(jobs).values(job).returning();
  return result;
};
