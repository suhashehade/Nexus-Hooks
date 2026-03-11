import { ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

export async function transform(order: Order): Promise<ActionResult> {
  try {
    if (!order.subscriber) {
      return {
        status: "skipped",
        reason: "no subscriber",
        order,
      };
    }

    if (order.subscriber === "accounting") {
      return {
        status: "success",
        order: {
          id: order.id,
          subscriber: order.subscriber,
          totalPrice: order.totalPrice,
          currency: order.currency,
          items: order.items,
          customer: order.customer,
        },
      };
    }

    if (order.subscriber === "shipping") {
      return {
        status: "success",
        order: {
          id: order.id,
          subscriber: order.subscriber,
          customer: order.customer,
        },
      };
    }

    return {
      status: "skipped",
      reason: "unknown subscriber",
      order,
    };
  } catch (error) {
    return {
      status: "failed",
      reason: "transform error",
      order,
    };
  }
}
