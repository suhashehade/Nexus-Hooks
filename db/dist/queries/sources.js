import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { sources } from "../schema.js";
export const createSource = async (source) => {
    const [result] = await db.insert(sources).values(source).returning();
    return result;
};
export const getSourceByID = async (sourceId) => {
    const [result] = await db
        .select()
        .from(sources)
        .where(eq(sources.id, sourceId));
    return result;
};
export const getSources = async () => {
    const result = await db.select().from(sources);
    return result;
};
export const getSource = async () => {
    const result = await db.select().from(sources).limit(1);
    return result;
};
