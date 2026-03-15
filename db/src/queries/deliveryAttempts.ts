import { db } from "../index.js";
import { delivery_attempts, DeliveryAttempt } from "../schema.js";

export const createDeliveryAttempt = async (
  deliveryAttempt: DeliveryAttempt,
) => {
  const [result] = await db
    .insert(delivery_attempts)
    .values(deliveryAttempt)
    .returning();
  return result;
};
