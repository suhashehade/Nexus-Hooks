import { db } from "../index.js";
import { delivery_attempts } from "../schema.js";
export const createDeliveryAttempt = async (deliveryAttempt) => {
    const [result] = await db
        .insert(delivery_attempts)
        .values(deliveryAttempt)
        .returning();
    return result;
};
