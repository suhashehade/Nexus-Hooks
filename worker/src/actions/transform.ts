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

    if (order.subscriber.name.toLocaleLowerCase() === "accounting") {
      return {
        status: "success",
        order: {
          id: order.id,
          customer: order.customer,
          subscriber: order.subscriber,
          totalPrice: (order.totalPrice || 0) * 2,
          items: order.items,
        },
      };
    }

    if (order.subscriber.name.toLocaleLowerCase() === "shipping") {
      return {
        status: "success",
        order: {
          id: order.id,
          customer: order.customer,
          subscriber: order.subscriber,
        },
      };
    }

    return {
      status: "skipped",
      reason: "unknown subscriber",
      order,
    };
  } catch (err) {
    return {
      status: "failed",
      error: (err as Error).message || "transform failed",
      order,
    };
  }
}
