import { Action } from "../schema.js";
export declare const createAction: (action: Action) => Promise<{
  required: boolean | null;
  type: string;
  id: string;
  order: number;
  description: string;
  config: unknown;
  createdAt: Date | null;
  editable: boolean | null;
}>;
export declare const getActions: () => Promise<
  {
    id: string;
    type: string;
    config: unknown;
    order: number;
    required: boolean | null;
    editable: boolean | null;
    description: string;
    createdAt: Date | null;
  }[]
>;
