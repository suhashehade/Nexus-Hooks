import { createSource } from "../queries/sources.js";
import { randomUUID } from "crypto";

export async function seedSources() {
  await createSource({
    id: randomUUID(),
    name: "Royal Restaurant",
  });

  await createSource({
    id: randomUUID(),
    name: "Hamsa Store",
  });

  console.log("✅ sources seeded");
}
