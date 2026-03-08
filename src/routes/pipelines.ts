import { Router } from "express";
import {
  addPipelineHandler,
  deletePipelineHandler,
  getAllPipelinesHandler,
  getPipelineByIDHandler,
} from "../controllers/pipelinesController.js";
import { validate } from "../middlewares/validate.js";
import {
  createBodySchema,
  createParamsSchema,
} from "../validation/pipeline.schema.js";

const router = Router();

router.post("/", validate(createBodySchema), addPipelineHandler);

router.get("/", getAllPipelinesHandler);

router.get(
  "/:pipelineId",
  validate(createParamsSchema, "params"),
  getPipelineByIDHandler,
);

router.delete(
  "/:pipelineId",
  validate(createParamsSchema, "params"),
  deletePipelineHandler,
);

export default router;
