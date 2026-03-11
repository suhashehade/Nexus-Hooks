import { ForkResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

export async function fork(
  order: Order,
  config: {
    subscribers: string[];
  },
): Promise<ForkResult> {
  try {
    if (!config.subscribers || config.subscribers.length === 0) {
      return {
        status: "skipped",
        reason: "no subscribers",
        orders: [order],
      };
    }

    const orders = config.subscribers.map((subscriber) => {
      const copy: Order = structuredClone(order);
      copy.subscriber = subscriber;
      return copy;
    });

    return {
      status: "success",
      orders,
    };
  } catch (err) {
    return {
      status: "failed",
      reason: (err as Error).message,
      orders: [order],
    };
  }
}
