import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { Source, sources } from "../schema.js";

export const createSource = async (source: Source) => {
  const [result] = await db.insert(sources).values(source).returning();
  return result;
};

export const getSourceByID = async (sourceId: string) => {
  const [result] = await db
    .select()
    .from(sources)
    .where(eq(sources.id, sourceId));
  return result;
};
