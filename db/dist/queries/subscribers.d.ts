import { SubScriber } from "../schema.js";
export declare const createSubscriber: (subscriber: SubScriber) => Promise<{
    id: string;
    name: string;
    url: string;
}>;
