import { Router } from "express";
import { webhookIngestionHandler } from "../controllers/webhookConrtoller.js";
import { validate } from "../middlewares/validate.js";
import { createWebhookSchema } from "../validation/webhook.schema.js";

const router = Router();

/**
 * @swagger
 * /api/nexus/webhooks:
 *   post:
 *     summary: Ingest webhook events
 *     tags: [Webhooks]
 *     parameters:
 *       - in: header
 *         name: X-API-KEY
 *         required: true
 *         schema:
 *           type: string
 *         description: Pipeline secret API key for webhook authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebhookPayload'
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook payload
 *       401:
 *         description: Missing or invalid API key
 */
router.post(
  "/",
  validate(createWebhookSchema, "body"),
  webhookIngestionHandler,
);

export default router;
