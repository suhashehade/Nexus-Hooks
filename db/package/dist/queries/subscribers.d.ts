import { SubScriber } from "../schema.js";
export declare const createSubscriber: (subscriber: SubScriber) => Promise<{
    name: string;
    id: string;
    url: string;
}>;
