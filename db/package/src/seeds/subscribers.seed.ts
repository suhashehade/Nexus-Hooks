import { createSubscriber } from "../queries/subscribers.js";
import { randomUUID } from "crypto";

export async function seedSubscribers() {
  await createSubscriber({
    id: randomUUID(),
    name: "Accounting",
    url: "http://localhost:8081/api/subscribers/accounting",
  });

  await createSubscriber({
    id: randomUUID(),
    name: "Shipping",
    url: "http://localhost:8081/api/subscribers/shipping",
  });

  console.log("✅ subscribers seeded");
}
