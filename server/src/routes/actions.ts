import { Router } from "express";
import { getAllActionsHandler } from "../controllers/actionsController.js";

const router = Router();

/**
 * @swagger
 * /api/actions:
 *   get:
 *     summary: Get all actions
 *     tags: [Actions]
 *     responses:
 *       200:
 *         description: List of all actions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Action'
 */
router.get("/", getAllActionsHandler);

export default router;
