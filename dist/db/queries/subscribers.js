import { db } from "../index.js";
import { subscribers } from "../schema.js";
export async function createSubscriber(subscriber) {
    const [result] = await db.insert(subscribers).values(subscriber).returning();
    return result;
}
