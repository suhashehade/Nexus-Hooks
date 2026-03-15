import { NextFunction, Request, Response } from "express";
import { deliver } from "../utils/deliver.js";
import { getJobDetails, updateJobStatus } from "db";
import { createLogger } from "../utils/logger.js";


const logger = createLogger('server');

export const deliverHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { jobId, jobName, pipelineName, orders } = req.body;

    logger.info('📦 Starting delivery process', { jobName, pipelineName, orderCount: orders.length });

    const promises = orders.map((order: any) => deliver(order, jobId, jobName, pipelineName, 1));

    const responses = await Promise.all(promises);

    const allSuccess = responses.every((r) => r.success);
    responses.forEach((r, k) => {
      if (!r.success) {
        logger.error(`❌ Failed to deliver to ${r.res.subscriberName}`, { jobName, pipelineName, subscriber: r.res.subscriberName });
      } else {
        logger.success(`✅ Successfully delivered to ${r.res.subscriberName}`, { jobName, pipelineName, subscriber: r.res.subscriberName });
      }
    });

    if (!allSuccess) {
      await updateJobStatus(jobId, "failed");
      logger.jobFailed(jobName, "Some deliveries failed");
    } else {
      await updateJobStatus(jobId, "completed");
      logger.jobCompleted(jobName, { deliveredOrders: orders.length });
    }

    // Call job details API to get formatted data and log it
    try {
      const jobDetails = await getJobDetails(jobId);
      
      logger.info('📊 Job Status Overview', {
        jobName: jobDetails?.name,
        status: jobDetails?.status,
        createdAt: jobDetails?.createdAt,
        processedAt: jobDetails?.processedAt,
        finishedAt: jobDetails?.finishedAt
      });

      // Log job status history as table
      if (jobDetails?.history) {
        const historyTable = jobDetails?.history.map((h: any) => ({
          Status: h.status,
          Time: h.time ? new Date(h.time).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : 'N/A',
          Duration: h.time ? `${Math.round((Date.now() - new Date(h.time).getTime()) / 1000)}s` : 'Pending'
        }));
        
        logger.info('📜 Job Status History Table', {
          jobName: jobDetails.name,
          table: historyTable
        });
      }

      // Log delivery attempts as table
      if (jobDetails?.deliveryAttempts && jobDetails?.deliveryAttempts.length > 0) {
        const attemptsTable = jobDetails?.deliveryAttempts.map((attempt: any) => ({
          Subscriber: attempt.subscriber,
          Attempt: attempt.attempt,
          Status: attempt.status,
          Time: attempt.time ? new Date(attempt.time).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : 'N/A'
        }));
        
        logger.info('📤 Delivery Attempts Table', {
          jobName: jobDetails?.name,
          table: attemptsTable
        });
      }

      logger.info('📊 Delivery process completed', { jobName, pipelineName, success: allSuccess });
      res.status(200).json({ status: "processed" });
    } catch (error: any) {
      logger.error('💥 Delivery handler failed', { error: error.message });
      next(error);
    }
  } catch (error: any) {
    logger.error('💥 Delivery handler failed', { error: error.message });
    next(error);
  }
};
