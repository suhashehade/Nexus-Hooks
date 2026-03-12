import { Action, ActionResult } from "../lib/types/action";

export async function filter(
  order: any,
  pipelineId: string,
  jobId: string,
  action: Action,
): Promise<ActionResult> {
  const price = order!.totalPrice!;
  const { name, config } = action;
  try {
    if (price < config!.minPrice) {
      return {
        status: "skipped",
        reason: `Order price ${price} is less than minimum ${config.minPrice}`,
      };
    }

    return {
      status: "success",
      order: order,
    };
  } catch (err: any) {
    return {
      status: "failed",
      error: err.message || "Unknown error",
      order: order,
    };
  }
}
