import { Action, Pipeline, Source, SubScriber } from "../schema.js";
export declare const createPipeline: (pipeline: Pipeline) => Promise<{
  name: string;
  id: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
  sourceId: string;
}>;
export declare const getPipelines: () => Promise<any[]>;
export declare const getPipelineByID: (pipelineId: string) => Promise<{
  id: string;
  name: string;
  source: Source;
  subscribers: SubScriber[];
  actions: Action[];
} | null>;
export declare const deletePipeline: (pipelineId: string) => Promise<void>;
export declare const getPipelineBySourceID: (sourceId: string) => Promise<{
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
