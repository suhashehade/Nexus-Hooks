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

/**
 * @swagger
 * /api/pipelines:
 *   post:
 *     summary: Create a new pipeline
 *     tags: [Pipelines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceId
 *               - subscribers
 *               - actions
 *             properties:
 *               sourceId:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the source
 *               subscribers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of subscriber identifiers
 *               actions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of action identifiers
 *     responses:
 *       201:
 *         description: Pipeline created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pipeline'
 *       400:
 *         description: Invalid request body
 */
router.post("/", validate(createBodySchema), addPipelineHandler);

/**
 * @swagger
 * /api/pipelines:
 *   get:
 *     summary: Get all pipelines
 *     tags: [Pipelines]
 *     responses:
 *       200:
 *         description: List of all pipelines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pipeline'
 */
router.get("/", getAllPipelinesHandler);

/**
 * @swagger
 * /api/pipelines/{pipelineId}:
 *   get:
 *     summary: Get a specific pipeline by ID
 *     tags: [Pipelines]
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the pipeline
 *     responses:
 *       200:
 *         description: Pipeline details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pipeline'
 *       404:
 *         description: Pipeline not found
 */
router.get(
  "/:pipelineId",
  validate(createParamsSchema, "params"),
  getPipelineByIDHandler,
);

/**
 * @swagger
 * /api/pipelines/{pipelineId}:
 *   delete:
 *     summary: Delete a specific pipeline by ID
 *     tags: [Pipelines]
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the pipeline
 *     responses:
 *       200:
 *         description: Pipeline deleted successfully
 *       404:
 *         description: Pipeline not found
 */
router.delete(
  "/:pipelineId",
  validate(createParamsSchema, "params"),
  deletePipelineHandler,
);

export default router;
