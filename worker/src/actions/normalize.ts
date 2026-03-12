import { Action, ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";

export async function normalize(
  order: Order,
  pipelineId: string,
  jobId: string,
  action: Action,
): Promise<ActionResult> {
  const { config, name } = action;
  const prefixes: string[] = config?.prefixes ?? ["+970", "+972"];

  try {
    const phone = order.customer?.phoneNumber;
    if (!phone) return { status: "skipped", reason: "no phone number", order };

    let phoneNumber = phone.replace(/\s+/g, "");
    for (const prefix of prefixes) {
      if (phoneNumber.startsWith(prefix)) {
        phoneNumber = phoneNumber.slice(prefix.length);
        break;
      }
    }

    if (phoneNumber.startsWith("0")) phoneNumber = phoneNumber.slice(1);

    let matchedPrefix: string | null = null;
    for (const prefix of prefixes) {
      if (
        prefix === "+972" &&
        ["2", "3", "4", "8", "9"].includes(phoneNumber[0])
      ) {
        matchedPrefix = prefix;
        break;
      }
      if (prefix === "+970") {
        matchedPrefix = prefix;
        break;
      }
    }

    if (!matchedPrefix)
      return { status: "skipped", reason: "unknown pattern", order };

    const newOrder: Order = {
      ...order,
      customer: { ...order.customer, phoneNumber: matchedPrefix + phoneNumber },
    };

    return { status: "success", order: newOrder };
  } catch (err: any) {
    return { status: "failed", reason: err.message, order };
  }
}
