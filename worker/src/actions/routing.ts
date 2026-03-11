import { ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

async function mockWebhookCall(subscriber: string, order: Order) {
  // نقدر نستبدلها لاحقًا بـ actual HTTP request
  console.log(`Sending order ${order.id} to ${subscriber} webhook`);
  return true;
}

export async function route(order: Order): Promise<ActionResult> {
  try {
    if (!order.subscriber) {
      return {
        status: "skipped",
        reason: "no subscriber",
        order,
      };
    }

    // إرسال لل subscriber
    const success = await mockWebhookCall(order.subscriber, order);

    if (!success) {
      return {
        status: "failed",
        reason: `Failed sending to ${order.subscriber}`,
        order,
      };
    }

    return {
      status: "success",
      order,
    };
  } catch (err) {
    return {
      status: "failed",
      reason: "route error",
      order,
    };
  }
}
