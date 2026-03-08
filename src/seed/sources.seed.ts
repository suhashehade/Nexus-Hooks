import { createSource } from "../db/queries/sources.js";
import { randomUUID } from "crypto";

export async function seedSources() {
  await createSource({
    id: randomUUID(),
    name: "Royal Restaurant",
    address: "Nablus",
    url: "http://localhost:3000/webhook",
  });

  await createSource({
    id: randomUUID(),
    name: "Hamsa Store",
    address: "Ramallah",
    url: "http://localhost:3001/webhook",
  });

  console.log("✅ sources seeded");
}
