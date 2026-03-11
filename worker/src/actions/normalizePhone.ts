import { ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

export async function normalizePhone(order: Order): Promise<ActionResult> {
  try {
    if (!order.customer?.phoneNumber) {
      return {
        status: "skipped",
        reason: "no phone number",
        order,
      };
    }

    let phoneNumber = order.customer.phoneNumber.replace(/\s+/g, "");

    if (phoneNumber.startsWith("0")) phoneNumber = phoneNumber.slice(1);

    const israeliPatterns = ["2", "3", "4", "8", "9"];
    const firstDigit = phoneNumber[0];

    if (israeliPatterns.includes(firstDigit)) {
      order.customer.phoneNumber = "+972" + phoneNumber;
    } else {
      order.customer.phoneNumber = "+970" + phoneNumber;
    }

    return { status: "success", order };
  } catch (err: any) {
    return { status: "failed", reason: err.message, order };
  }
}
