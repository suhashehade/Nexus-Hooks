import { getSubscribers } from "db";
import { NextFunction, Request, Response } from "express";

export const getAllSubscribersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscribers = await getSubscribers();
    res.status(200).json({ data: subscribers, status: "ok" });
  } catch (error) {
    next(error as Error);
  }
};
