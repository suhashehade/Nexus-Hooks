import { Job } from "../schema.js";
export declare const createJob: (job: Job) => Promise<{
  id: string;
  name: string;
  createdAt: Date;
  pipelineId: string;
  payload: unknown;
  status: string;
  processedAt: Date | null;
  finishedAt: Date | null;
}>;
export declare const getQueuedJob: () => Promise<Job | null>;
export declare const getJobDetails: (jobId: string) => Promise<any>;
export declare const getJobsByPipelineId: (pipelineId: string) => Promise<
  {
    id: string;
    pipelineId: string;
    payload: unknown;
    name: string;
    status: string;
    createdAt: Date;
    processedAt: Date | null;
    finishedAt: Date | null;
  }[]
>;
export declare const updateJobStatus: (
  jobId: string,
  status: string,
) => Promise<void>;
