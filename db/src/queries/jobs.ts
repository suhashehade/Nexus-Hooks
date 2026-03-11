import { db } from "../index.js";
import { Job, jobs } from "../schema.js";

export const createJob = async (job: Job) => {
  const [result] = await db.insert(jobs).values(job).returning();
  return result;
};

// export const getJob = async (job: Job) => {
//   const [result] = await db.insert(jobs).values(job).returning();
//   return result;
// };
