import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validate =
  <T extends ZodTypeAny>(
    schema: T,
    type: "body" | "query" | "params" = "body",
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = req[type];

    const result = schema.safeParse(data);
    if (!result.success) throw result.error;

    req[type] = result.data;
    next();
  };
