import { db } from "../index.js";
import { SubScriber, subscribers } from "../schema.js";

export const createSubscriber = async (subscriber: SubScriber) => {
  const [result] = await db.insert(subscribers).values(subscriber).returning();
  return result;
};

export const getSubscribers = async () => {
  const result = await db.select().from(subscribers);
  return result;
};

export const getSubscriber = async () => {
  const result = await db.select().from(subscribers).limit(1);
  return result;
};
