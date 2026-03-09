import { db } from "../index.js";
import { subscribers } from "../schema.js";
export const createSubscriber = async (subscriber) => {
    const [result] = await db.insert(subscribers).values(subscriber).returning();
    return result;
};
