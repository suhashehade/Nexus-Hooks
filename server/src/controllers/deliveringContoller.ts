import { NextFunction, Request, Response } from "express";
import { deliver } from "../utils/deliver.js";
import { updateJobStatus } from "db";

export const deliverHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { jobId, orders } = req.body;

    const promises = orders.map((order: any) => deliver(order, jobId, 1));

    const responses = await Promise.all(promises);

    const allSuccess = responses.every((r) => r.success);
    responses.forEach((r, k) => {
      if (!r.success) {
        console.log(`Fail to deliver to ${responses[0].res.subscriberName}`);
      }
    });

    if (!allSuccess) {
      await updateJobStatus(jobId, "failed");
    } else {
      await updateJobStatus(jobId, "completed");
    }

    console.log("Processed result:", JSON.stringify(orders, null, 2));

    res.status(200).json({ status: "processed" });
  } catch (error) {
    next(error);
  }
};
