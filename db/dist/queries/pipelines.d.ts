import { Pipeline } from "../schema.js";
export declare const createPipeline: (pipeline: Pipeline) => Promise<{
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  sourceId: string;
  secret: string;
}>;
export declare const getPipelines: () => Promise<any[]>;
export declare const getPipelineByID: (pipelineId: string) => Promise<any>;
export declare const deletePipeline: (pipelineId: string) => Promise<void>;
export declare const getPipelineBySecret: (sectet: string) => Promise<{
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sourceId: string;
  name: string;
  secret: string;
}>;
export declare const updatePipelineStatus: (
  pipelineId: string,
  pipeline: Pipeline,
) => Promise<void>;
