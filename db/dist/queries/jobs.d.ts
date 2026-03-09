import { Job } from "../schema.js";
export declare const createJob: (job: Job) => Promise<{
    id: string;
    createdAt: Date;
    pipelineId: string;
    payload: unknown;
    status: string;
    priority: number | null;
    attempts: number | null;
    processedAt: Date;
}>;
