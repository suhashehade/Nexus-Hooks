import { BadRequestError, ForbiddenError, NotFoundError, UnAuthorizedError, } from "../lib/classes/errors.js";
import z from "zod";
export function errorHandlerMiddleware(err, req, res, next) {
    if (err instanceof BadRequestError) {
        return res.status(400).send({
            error: err.message,
        });
    }
    if (err instanceof UnAuthorizedError) {
        return res.status(401).send({
            error: err.message,
        });
    }
    if (err instanceof ForbiddenError) {
        return res.status(403).send({
            error: err.message,
        });
    }
    if (err instanceof NotFoundError) {
        return res.status(404).send({
            error: err.message,
        });
    }
    if (err instanceof z.ZodError) {
        return res.status(400).send({
            errors: err.issues,
        });
        /* [
          {
            expected: 'string',
            code: 'invalid_type',
            path: [ 'username' ],
            message: 'Invalid input: expected string'
          },
          {
            expected: 'number',
            code: 'invalid_type',
            path: [ 'xp' ],
            message: 'Invalid input: expected number'
          }
        ] */
    }
    next(err);
}
