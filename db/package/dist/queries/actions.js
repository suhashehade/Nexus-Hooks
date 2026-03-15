import { db } from "../index.js";
import { actions } from "../schema.js";
export const createAction = async (action) => {
  const [result] = await db.insert(actions).values(action).returning();
  return result;
};
export const getActions = async () => {
  const result = await db.select().from(actions);
  return result;
};
