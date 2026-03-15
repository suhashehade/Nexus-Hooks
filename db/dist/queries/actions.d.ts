import { Action } from "../schema.js";
export declare const createAction: (action: Action) => Promise<{
    id: string;
    createdAt: Date | null;
    type: string;
    config: unknown;
    order: number;
    required: boolean | null;
    editable: boolean | null;
    description: string;
}>;
export declare const getActions: () => Promise<{
    id: string;
    type: string;
    config: unknown;
    order: number;
    required: boolean | null;
    editable: boolean | null;
    description: string;
    createdAt: Date | null;
}[]>;
export declare const getAction: () => Promise<{
    id: string;
    type: string;
    config: unknown;
    order: number;
    required: boolean | null;
    editable: boolean | null;
    description: string;
    createdAt: Date | null;
}[]>;
