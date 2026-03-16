import { getSources } from "db";
import { NextFunction, Request, Response } from "express";

export const getAllSourcesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sources = await getSources();
    res.status(200).json({ data: sources, status: "ok" });
  } catch (error) {
    next(error as Error);
  }
};
