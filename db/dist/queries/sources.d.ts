import { Source } from "../schema.js";
export declare const createSource: (source: Source) => Promise<{
    id: string;
    name: string;
}>;
export declare const getSourceByID: (sourceId: string) => Promise<{
    id: string;
    name: string;
}>;
export declare const getSources: () => Promise<{
    id: string;
    name: string;
}[]>;
export declare const getSource: () => Promise<{
    id: string;
    name: string;
}[]>;
