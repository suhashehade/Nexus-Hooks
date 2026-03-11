import { ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

export async function recalculateTotalPrice(order: Order): Promise<ActionResult> {
  try {
    const sum = order.items!.reduce((acc, item) => acc + item.price!, 0);

    if (sum !== order.totalPrice) {
      order.totalPrice = sum;
    }

    return { status: "success", order };
  } catch (err) {
    return { status: "failed", reason: (err as Error).message, order };
  }
}
