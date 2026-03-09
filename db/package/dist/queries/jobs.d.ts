import { Job } from "../schema.js";
export declare const createJob: (job: Job) => Promise<{
    id: string;
    priority: number | null;
    status: string;
    createdAt: Date;
    pipelineId: string;
    payload: unknown;
    attempts: number | null;
    processedAt: Date;
}>;
