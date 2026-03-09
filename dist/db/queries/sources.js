import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { sources } from "../schema.js";
export async function createSource(source) {
    const [result] = await db.insert(sources).values(source).returning();
    return result;
}
export async function getSourceByID(sourceId) {
    const [result] = await db
        .select()
        .from(sources)
        .where(eq(sources.id, sourceId));
    return result;
}
export async function getSourceByURL(sourceURL) {
    const [result] = await db
        .select()
        .from(sources)
        .where(eq(sources.url, sourceURL));
    return result;
}
