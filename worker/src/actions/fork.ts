import { Action, ForkResult } from "../lib/types/action";
import { Order, Subscriber } from "../lib/types/job";

export async function fork(
  order: Order,
  config: {
    subscribers: Subscriber[];
  },
  pipelineId: string,
  jobId: string,
  action: Action,
): Promise<ForkResult> {
  try {
    if (!order) {
      return {
        status: "failed",
        reason: "no order",
        orders: [order],
      };
    }
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
