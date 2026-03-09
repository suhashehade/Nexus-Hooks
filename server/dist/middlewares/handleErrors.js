import { BadRequestError, ForbiddenError, NotFoundError, UnAuthorizedError, } from "../lib/classes/errors.js";
import z from "zod";
export const errorHandlerMiddleware = (err, req, res, next) => {
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
    return res.status(500).send({
        error: "Internal Server Error",
    });
};
