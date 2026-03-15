import { Source } from "../schema.js";
export declare const createSource: (source: Source) => Promise<{
  name: string;
  id: string;
  address: string;
  url: string;
}>;
export declare const getSourceByID: (sourceId: string) => Promise<{
  id: string;
  name: string;
  address: string;
  url: string;
}>;
export declare const getSourceByURL: (sourceURL: string) => Promise<{
  id: string;
  name: string;
  address: string;
  url: string;
}>;
