import axios from "axios";
import { createDeliveryAttempt } from "db";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const deliver = async (
  order: any,
  jobId: string,
  attempt = 1,
): Promise<any> => {
  try {
    await axios.post(order.subscriber.url, order);

    const res = await createDeliveryAttempt({
      jobId,
      subscriberId: order.subscriber.id,
      status: "success",
      attempt,
    });

    return {
      success: true,
      res: { ...res, subscriberName: order.subscriber.name },
    };
  } catch (err) {
    await createDeliveryAttempt({
      jobId,
      subscriberId: order.subscriber.id,
      status: "failed",
      attempt,
    });

    if (attempt < 5) {
      console.log(
        `Remain ${5 - attempt}/5 attempts to deliver to ${order.subscriber.name}: ${order.subscriber.url} for job ${jobId}`,
      );

      await sleep(10000);

      return deliver(order, jobId, attempt + 1);
    }

    return {
      success: false,
      res: { subscriberName: order.subscriber.name },
    };
  }
};
