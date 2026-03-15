import { NextFunction, Request, Response } from "express";

export const healthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(200).json({ status: "ok" });
  } catch (error: any) {
    next(error);
  }
};
