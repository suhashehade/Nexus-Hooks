import { Router } from "express";
import { getAllSubscribersHandler } from "../controllers/subscibersController.js";

const router = Router();

/**
 * @swagger
 * /api/subscribers:
 *   get:
 *     summary: Get all subscribers
 *     tags: [Subscribers]
 *     responses:
 *       200:
 *         description: List of all subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscriber'
 */
router.get("/", getAllSubscribersHandler);

export default router;
