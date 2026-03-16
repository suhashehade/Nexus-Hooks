import { Router } from "express";
import { deliverHandler } from "../controllers/deliveringContoller.js";

const router = Router();

/**
 * @swagger
 * /internal/deliver:
 *   post:
 *     summary: Internal endpoint for delivering processed events to subscribers
 *     tags: [Internal]
 *     description: This endpoint is used internally by the system to deliver processed webhook events to subscribers. Should not be called directly by external clients.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryRequest'
 *     responses:
 *       200:
 *         description: Event delivered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryResponse'
 *       400:
 *         description: Invalid delivery request
 *       500:
 *         description: Internal server error during delivery
 */
router.post("/", deliverHandler);

export default router;
