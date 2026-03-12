import { Action, ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

export async function recalculate(
  order: Order,
  pipelineId: string,
  jobId: string,
  action: Action,
): Promise<ActionResult> {
  const { config, name } = action;

  try {
    if (!config?.totalPrice) {
      return { status: "skipped", reason: "totalPrice recalc disabled", order };
    }

    const sum =
      order.items?.reduce((acc, item) => acc + (item.price ?? 0), 0) ?? 0;

    if (order.totalPrice !== sum) {
      order.totalPrice = sum;
    }

    return { status: "success", order };
  } catch (err: any) {
    return { status: "failed", reason: err.message, order };
  }
}
