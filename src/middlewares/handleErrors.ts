import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnAuthorizedError,
} from "../lib/classes/errors.js";
import { PostgresError } from "postgres";
import z from "zod";

export function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof BadRequestError) {
    return res.status(400).send({ error: err.message });
  }

  if (err instanceof UnAuthorizedError) {
    return res.status(401).send({ error: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).send({ error: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).send({ error: err.message });
  }

  if (err instanceof z.ZodError) {
    return res.status(400).send({
      errors: err.issues,
    });
  }

  if (err instanceof PostgresError) {
    if (err.code === "23505") {
      return res.status(409).send({
        error: "Duplicate record",
      });
    }

    if (err.code === "23503") {
      return res.status(400).send({
        error: "Invalid reference (foreign key)",
      });
    }

    if (err.code === "23502") {
      return res.status(400).send({
        error: "Missing required field",
      });
    }
  }

  return res.status(500).send({
    error: "Internal Server Error",
  });
}
