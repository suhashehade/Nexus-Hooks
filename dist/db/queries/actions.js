import { db } from "../index.js";
import { actions } from "../schema.js";
export async function createAction(action) {
    const [result] = await db.insert(actions).values(action).returning();
    return result;
}
export async function getActions() {
    const result = await db.select().from(actions);
    return result;
}
