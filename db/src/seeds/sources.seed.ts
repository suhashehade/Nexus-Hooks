import { createSource } from "../queries/sources.js";
import { randomUUID } from "crypto";

export async function seedSources() {
  await createSource({
    id: randomUUID(),
    name: "Royal Restaurant",
    address: "Nablus",
    url: "http://localhost:4000/api/webhooks/sources/royal",
  });

  await createSource({
    id: randomUUID(),
    name: "Hamsa Store",
    address: "Ramallah",
    url: "http://localhost:4000/api/webhooks/sources/hamsa",
  });

  console.log("✅ sources seeded");
}
