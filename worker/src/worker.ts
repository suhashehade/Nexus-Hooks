import { getPipelineByID, getQueuedJob } from "db";
import { runJob } from "./executor.js";
import axios from "axios";

async function runWorker() {
  const SERVER_INTERNAL_URL = process.env.SERVER_URL || "http://localhost:4000/internal/deliver";
  while (true) {
    try {
      const job = await getQueuedJob();
      if (!job) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        continue;
      } else {
        console.log("Starting worker with mock job...");
      }

      const pipelineId: string = job.pipelineId;
      const pipeline = await getPipelineByID(pipelineId);

      const orders = await runJob(job, pipeline);
      try {
        await axios.post(
          SERVER_INTERNAL_URL,
          {
            orders,
            jobId: job!.id!,
          },
          { timeout: 5000 },
        );
      } catch (error: any) {
        console.log("Error", error.message);
      }
    } catch (error: any) {
      console.log("Error: ", error.message);
    }
  }
}

await runWorker();
