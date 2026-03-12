import {
  createDeliveryAttempt,
  getJob,
  getPipelineByID,
  updateJobStatus,
} from "db";
import { runJob } from "./executor.js";
import axios from "axios";
import { Order, Subscriber } from "./lib/types/job.js";

async function runWorker() {
  while (true) {
    try {
      const job = await getJob();
      if (!job) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      } else {
        console.log("Starting worker with mock job...");
      }

      const pipelineId: string = job.pipelineId;
      const pipeline = await getPipelineByID(pipelineId);

      const orders = await runJob(job, pipeline);
      const promises = orders.map(async (order: Order) => {
        try {
          const res = await axios.post(order.subscriber!.url, order);

          await createDeliveryAttempt({
            jobId: job!.id!,
            subscriberId: order.subscriber!.id,
            status: "success",
            attempt: 1,
          });

          return { success: true, res };
        } catch (err: any) {
          await createDeliveryAttempt({
            jobId: job!.id!,
            subscriberId: order.subscriber!.id,
            status: "failed",
            attempt: 1,
          });

          console.log(`Delivery failed for ${order.subscriber!.name}`);

          return { success: false };
        }
      });

      const responses = await Promise.all(promises);
      try {
        console.log("Processed result:", JSON.stringify(orders, null, 2));
        if (!responses[0].success || !responses[1].success) {
          await updateJobStatus(job!.id!, "failed");
        } else {
          await updateJobStatus(job!.id!, "completed");
          console.log("response #1:", JSON.stringify(responses[0].res?.data));
          console.log("response #2:", JSON.stringify(responses[1].res?.data));
        }
      } catch (err: any) {
        await updateJobStatus(job!.id!, "failed");
        console.log("Error: ", err.message);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  }
}

await runWorker();
