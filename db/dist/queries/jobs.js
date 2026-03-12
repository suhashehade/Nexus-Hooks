import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { jobs } from "../schema.js";
export const createJob = async (job) => {
    const [result] = await db.insert(jobs).values(job).returning();
    return result;
};
export const getJob = async () => {
    return await db.transaction(async (tx) => {
        const [job] = await tx.execute(sql `
      SELECT 
        id,
        payload,
        status,
        priority,
        attempts,
        created_at AS "createdAt",
        processed_at AS "processedAt",
        pipeline_id AS "pipelineId"
      FROM jobs
      WHERE status = 'pending' AND attempts < 5
      ORDER BY priority DESC, created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    `);
        if (!job)
            return null;
        await tx.execute(sql `
      UPDATE jobs
      SET status = 'processing',
          attempts = attempts + 1,
          processed_at = now()
      WHERE id = ${job.id}
    `);
        return job;
    });
};
export const updateJobStatus = async (jobId, status) => {
    await db.update(jobs).set({ status: status }).where(eq(jobs.id, jobId));
};
