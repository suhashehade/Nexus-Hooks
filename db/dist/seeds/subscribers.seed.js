import { createSubscriber } from "../queries/subscribers.js";
import { randomUUID } from "crypto";
export async function seedSubscribers() {
    await createSubscriber({
        id: randomUUID(),
        name: "Accounting",
        url: "http://subscriber_accounting:5001/api/subscribers/accounting",
    });
    await createSubscriber({
        id: randomUUID(),
        name: "Shipping",
        url: "http://subscriber_shipping:5002/api/subscribers/shipping",
    });
    console.log("✅ subscribers seeded");
}
