import { db } from "../index.js";
import { SubScriber, subscribers } from "../schema.js";

export const createSubscriber = async (subscriber: SubScriber) => {
  const [result] = await db.insert(subscribers).values(subscriber).returning();
  return result;
};
