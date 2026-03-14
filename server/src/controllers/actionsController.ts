import { getActions } from "db";
import { NextFunction, Request, Response } from "express";

export const getAllActionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const actions = await getActions();
    res.status(200).json(actions);
  } catch (error: any) {
    next(error);
  }
};
