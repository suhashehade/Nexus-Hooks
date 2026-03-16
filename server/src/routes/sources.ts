import { Router } from "express";
import { getAllSourcesHandler } from "../controllers/sourcesController.js";

const router = Router();

/**
 * @swagger
 * /api/sources:
 *   get:
 *     summary: Get all sources
 *     tags: [Sources]
 *     responses:
 *       200:
 *         description: List of all sources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Source'
 */
router.get("/", getAllSourcesHandler);

export default router;
