import { ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

export async function mergeDup(order: Order): Promise<ActionResult> {
  const items = order.items!;

  try {
    const map = new Map<string, any>();

    for (const item of items) {
      const key = item.name!;

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
    };
  }
}
