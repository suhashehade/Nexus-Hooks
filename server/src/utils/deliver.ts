import axios from "axios";
import { createDeliveryAttempt } from "db";
import { createLogger } from "./logger.js";

const logger = createLogger("server");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const deliver = async (
  order: any,
  jobId: string,
  jobName: string,
  pipelineName: string,
  attempt = 1,
): Promise<any> => {
  try {
    logger.info(`📤 Attempting delivery to ${order.subscriber.name}`, {
      jobName,
      pipelineName,
      subscriber: order.subscriber.name,
      url: order.subscriber.url,
      attempt,
    });

    await axios.post(order.subscriber.url, order);

    const res = await createDeliveryAttempt({
      jobId,
      subscriberId: order.subscriber.id,
      status: "success",
      attempt,
    });

    logger.deliveryAttempt(
      jobName,
      pipelineName,
      order.subscriber.name,
      attempt,
      "success",
    );

    return {
      success: true,
      res: { ...res, subscriberName: order.subscriber.name },
    };
  } catch (err: any) {
    await createDeliveryAttempt({
      jobId,
      subscriberId: order.subscriber.id,
      status: "failed",
      attempt,
    });

    logger.deliveryAttempt(
      jobName,
      pipelineName,
      order.subscriber.name,
      attempt,
      "failed",
    );
    logger.warning(`📤 Delivery failed to ${order.subscriber.name}`, {
      jobName,
      pipelineName,
      subscriber: order.subscriber.name,
      error: err.message,
      attempt,
    });

    if (attempt < 5) {
      logger.info(
        `⏱️ Retrying delivery to ${order.subscriber.name} in 10 seconds`,
        {
          jobName,
          pipelineName,
          subscriber: order.subscriber.name,
          attempt,
          nextAttempt: attempt + 1,
        },
      );

      await sleep(10000);

      return deliver(order, jobId, jobName, pipelineName, attempt + 1);
    }

    logger.error(`💥 Max retries reached for ${order.subscriber.name}`, {
      jobName,
      pipelineName,
      subscriber: order.subscriber.name,
      maxAttempts: 5,
    });

    return {
      success: false,
      res: { subscriberName: order.subscriber.name },
    };
  }
};
