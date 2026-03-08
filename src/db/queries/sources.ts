import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { Source, sources } from "../schema.js";

export async function createSource(source: Source) {
  const [result] = await db.insert(sources).values(source).returning();
  return result;
}

export async function getSourceByID(sourceId: string) {
  const [result] = await db
    .select()
    .from(sources)
    .where(eq(sources.id, sourceId));
  return result;
}

// export async function getChirps() {
//   const result = await db.select().from(chirps);
//   return result;
// }

// export async function getChirpsByUserId(authorId: string) {
//   const result = await db
//     .select()
//     .from(chirps)
//     .where(eq(chirps.user_id, authorId));
//   return result;
// }

// export async function deleteChirpById(chirpId: string) {
//   await db.delete(chirps).where(eq(chirps.id, chirpId));
//   return;
// }
