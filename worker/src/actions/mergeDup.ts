import { Action, ActionResult } from "../lib/types/action";
import { Order, OrderItem } from "../lib/types/job";

export async function mergeDup(
  order: Order,
  pipelineId: string,
  jobId: string,
  action: Action,
): Promise<ActionResult> {
  const { name, config } = action;
  const items = order.items!;

  try {
    const map = new Map<any, any>();
    const mergeBy: keyof OrderItem = config.mergeBy!;
    for (const item of items) {
      const key = item[mergeBy];
      if (map.has(key)) {
        const existing = map.get(key);
        existing.price += item.price;
      } else {
        map.set(key, { ...item });
      }
    }

    order.items = Array.from(map.values());

    return {
      status: "success",
      order,
    };
  } catch (err: any) {
    return {
      status: "failed",
      error: err.message || "unknown error",
      order,
    };
  }
}
