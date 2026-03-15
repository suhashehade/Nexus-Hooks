import { Action, ActionResult } from "../lib/types/action";
import { Order, OrderItem } from "../lib/types/job";

export async function mergeDup(
  order: Order,
  action: Action,
): Promise<ActionResult> {
  const { config } = action;
  const items = order.items;

  try {
    const map = new Map<unknown, unknown>();
    const mergeBy: keyof OrderItem = config.mergeBy;
    if (items) {
      for (const item of items) {
        const key = item[mergeBy];
        if (map.has(key)) {
          const existing = map.get(key) as OrderItem;
          existing.price = (existing.price || 0) + (item.price || 0);
        } else {
          map.set(key, { ...item });
        }
      }
    }

    order.items = Array.from(map.values()) as OrderItem[];

    return {
      status: "success",
      order,
    };
  } catch (err) {
    return {
      status: "failed",
      error: (err as Error).message || "unknown error",
      order,
    };
  }
}
