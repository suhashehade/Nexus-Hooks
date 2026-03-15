import { getPipelineByID, getQueuedJob } from "db";
import { runJob } from "./executor.js";
import axios from "axios";
import { createLogger } from "./utils/logger.js";

const logger = createLogger('worker');

async function runWorker() {
  const SERVER_INTERNAL_URL = process.env.SERVER_URL || "http://localhost:4000/internal/deliver";
  
  logger.info('🤖 Worker started', { serverUrl: SERVER_INTERNAL_URL });
  
  while (true) {
    try {
      const job = await getQueuedJob();
      if (!job) {
        logger.debug('⏳ No jobs available, waiting...', { waitTime: '10s' });
        await new Promise((resolve) => setTimeout(resolve, 10000));
        continue;
      } else {
        logger.jobStarted(job.name!, 'Loading pipeline...');
      }

      const pipelineId: string = job.pipelineId!;
      const pipeline = await getPipelineByID(pipelineId);

      if (!pipeline) {
        logger.error('❌ Pipeline not found', { jobName: job.name! });
        continue;
      }

      logger.info('📥 Job Input Payload', { 
        jobName: job.name!, 
        payload: JSON.stringify(job.payload, null, 2)
      });

      logger.info('⚙️ Executing job pipeline', { jobName: job.name!, pipelineName: pipeline.name });
      const orders = await runJob(job, pipeline);
      
      logger.info(`📦 Job execution completed, processing ${orders.length} orders`, { jobName: job.name!, orderCount: orders.length });
      
      logger.info('📤 Job Output Payload', { 
        jobName: job.name!, 
        orders: JSON.stringify(orders, null, 2)
      });
      
      try {
        logger.info('📤 Sending results to server', { jobName: job!.name, pipelineName: pipeline!.name, serverUrl: SERVER_INTERNAL_URL });
        await axios.post(
          SERVER_INTERNAL_URL,
          {
            orders,
            jobId: job!.id!,
            jobName: job!.name,
            pipelineName: pipeline!.name,
          },
          { timeout: 5000 },
        );
        logger.success('✅ Results sent to server successfully', { jobName: job!.name, pipelineName: pipeline!.name });
      
        console.log('=====================================\n');
        
      } catch (error: any) {
        logger.error('❌ Failed to send results to server', { jobName: job.name!, error: error.message });
      }
    } catch (error: any) {
      logger.error('💥 Worker error', { error: error.message });
    }
  }
}

await runWorker();
