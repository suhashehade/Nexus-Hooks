import { createSubscriber } from "../db/queries/subscribers.js";
import { randomUUID } from "crypto";
export async function seedSubscribers() {
    await createSubscriber({
        id: randomUUID(),
        name: "Accounting",
        url: "http://localhost:4000/accounting",
    });
    await createSubscriber({
        id: randomUUID(),
        name: "Shipping",
        url: "http://localhost:4001/shipping",
    });
    console.log("✅ subscribers seeded");
}
