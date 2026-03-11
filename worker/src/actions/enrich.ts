import { ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

export async function enrich(order: Order): Promise<ActionResult> {
  try {
    if (!order.subscriber) {
      return {
        status: "skipped",
        reason: "no subscriber",
        order,
      };
    }

    // accounting enrichment
    if (order.subscriber === "accounting") {
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

    // shipping enrichment
    if (order.subscriber === "shipping") {
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
