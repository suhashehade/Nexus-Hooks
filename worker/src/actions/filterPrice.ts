import { ActionResult } from "../lib/types/action";

export async function filterPrice(
  order: any,
  config: { minPrice: number },
): Promise<ActionResult> {
  const price = order.totalPrice;

  try {
    if (price < config.minPrice) {
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
    return { status: "failed", error: err.message || "Unknown error" };
  }
}
