import { ActionResult } from "../lib/types/action.js";
import { Order } from "../lib/types/job.js";

export async function enrich(order: Order): Promise<ActionResult> {
  try {
    if (!order.subscriber) {
      return {
        status: "skipped",
        reason: "no subscriber",
        order,
      };
    }

    if (order.subscriber.name.toLocaleLowerCase() === "accounting") {
      if (order.totalPrice == null) {
        return {
          status: "skipped",
          reason: "missing totalPrice",
          order,
        };
      }

      const TAX = 0.17;

      return {
        status: "success",
        order: {
          ...order,
          totalPriceWithTax: Number((order.totalPrice * (1 + TAX)).toFixed(2)),
        },
      };
    }

    if (order.subscriber.name.toLocaleLowerCase() === "shipping") {
      const city = order.customer?.city?.toLowerCase();

      let zone = "unknown";

      if (city === "nablus") zone = "north";
      else if (city === "ramallah") zone = "center";
      else if (city === "hebron") zone = "south";

      return {
        status: "success",
        order: {
          ...order,
          shippingZone: zone,
        },
      };
    }

    return {
      status: "skipped",
      reason: "unknown subscriber",
      order,
    };
  } catch {
    return {
      status: "failed",
      reason: "enrich error",
      order,
    };
  }
}
