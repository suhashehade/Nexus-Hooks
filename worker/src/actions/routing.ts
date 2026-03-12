import { updateJobStatus } from "db";
import { Action, ActionResult } from "../lib/types/action";
import { Order } from "../lib/types/job";
import axios from "axios";

export async function route(
  order: Order,
  pipelineId: string,
  jobId: string,
  action: Action,
): Promise<ActionResult> {
  try {
    if (!order.subscriber) {
      return {
        status: "skipped",
        reason: "no subscriber",
        order,
      };
    }

    // إرسال لل subscriber
    const response = await axios.post(order.subscriber.url, order);

    if (response.status !== 200) {
      // await updateJobStatus(jobId, "failed");
      return {
        status: "failed",
        reason: `Failed sending to ${order.subscriber}`,
      };
    }
    // await updateJobStatus(jobId, "completed");
    return {
      status: "success",
      order,
    };
  } catch (err) {
    // await updateJobStatus(jobId, "failed");
    return {
      status: "failed",
      reason: "route error",
    };
  }
}
