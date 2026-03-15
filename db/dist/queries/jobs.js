import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { delivery_attempts, jobs, subscribers, } from "../schema.js";
export const createJob = async (job) => {
    const [result] = await db.insert(jobs).values(job).returning();
    return result;
};
export const getQueuedJob = async () => {
    return await db.transaction(async (tx) => {
        const [job] = await tx.execute(sql `
      SELECT 
        id,
        payload,
        status,
        name,
        created_at AS "createdAt",
        processed_at AS processedAt,
        finished_at AS finishedAt,
        pipeline_id AS "pipelineId"
      FROM jobs
      WHERE status = 'queued' 
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    `);
        if (!job)
            return null;
        await tx.execute(sql `
      UPDATE jobs
      SET status = 'processing',
        processed_at = now()
      WHERE id = ${job.id}
    `);
        return job;
    });
};
export const getJobDetails = async (jobId) => {
    const rows = await db
        .select({
        jobId: jobs.id,
        jobName: jobs.name,
        status: jobs.status,
        createdAt: jobs.createdAt,
        processedAt: jobs.processedAt,
        finishedAt: jobs.finishedAt,
        attemptId: delivery_attempts.id,
        attempt: delivery_attempts.attempt,
        deliveryStatus: delivery_attempts.status,
        attemptCreatedAt: delivery_attempts.createdAt,
        subscriberId: subscribers.id,
        subscriberName: subscribers.name,
    })
        .from(jobs)
        .leftJoin(delivery_attempts, eq(delivery_attempts.jobId, jobs.id))
        .leftJoin(subscribers, eq(subscribers.id, delivery_attempts.subscriberId))
        .where(eq(jobs.id, jobId));
    const jobMap = new Map();
    for (const row of rows) {
        if (!jobMap.has(row.jobId)) {
            jobMap.set(row.jobId, {
                id: rows[0].jobId,
                name: rows[0].jobName,
                status: rows[0].status,
                history: [
                    { status: "queued", time: rows[0].createdAt },
                    { status: "processing", time: rows[0].processedAt },
                    { status: rows[0].status, time: rows[0].finishedAt },
                ],
                subscribers: [],
                deliveryAttempts: [],
            });
        }
        const job = jobMap.get(row.jobId);
        if (row.subscriberId &&
            !job.subscribers.some((s) => s.id === row.subscriberId)) {
            job.subscribers.push({
                id: row.subscriberId,
                name: row.subscriberName,
            });
        }
        if (row.attemptId &&
            !job.deliveryAttempts.some((a) => a.id === row.attemptId)) {
            job.deliveryAttempts.push({
                subscriber: row.subscriberName,
                attempt: row.attempt,
                status: row.deliveryStatus,
                time: row.attemptCreatedAt,
            });
        }
    }
    return jobMap.get(jobId);
};
export const getJobsByPipelineId = async (pipelineId) => {
    const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.pipelineId, pipelineId));
    return result;
};
export const updateJobStatus = async (jobId, status) => {
    await db
        .update(jobs)
        .set({ status: status, finishedAt: new Date() })
        .where(eq(jobs.id, jobId));
};
