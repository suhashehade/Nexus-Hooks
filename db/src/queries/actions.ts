import { db } from "../index.js";
import { Action, actions } from "../schema.js";

export const createAction = async (action: Action) => {
  const [result] = await db.insert(actions).values(action).returning();
  return result;
};

export const getActions = async () => {
  const result = await db.select().from(actions);
  return result;
};

export const getAction = async () => {
  const result = await db.select().from(actions).limit(1);
  return result;
};
