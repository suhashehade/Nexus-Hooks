import { createSource } from "../db/queries/sources.js";
import { randomUUID } from "crypto";
export async function seedSources() {
    await createSource({
        id: randomUUID(),
        name: "Royal Restaurant",
        address: "Nablus",
    });
    await createSource({
        id: randomUUID(),
        name: "Hamsa Store",
        address: "Ramallah",
    });
    console.log("✅ sources seeded");
}
