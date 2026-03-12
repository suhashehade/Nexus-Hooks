import { Job } from "../schema.js";
export declare const createJob: (job: Job) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    pipelineId: string;
    payload: unknown;
    status: string;
    priority: number | null;
    attempts: number | null;
    processedAt: Date;
}>;
export declare const getJob: () => Promise<Job | null>;
export declare const updateJobStatus: (jobId: string, status: string) => Promise<void>;
