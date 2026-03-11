import { Router } from "express";
import { webhookIngestionHandler } from "../controllers/webhookConrtoller.js";
import { validate } from "../middlewares/validate.js";
import { createWebhookSchema } from "../validation/webhook.schema.js";

const router = Router();

router.post(
  "/sources/:sourceName",
  validate(createWebhookSchema, "body"),
  webhookIngestionHandler,
); // :sourceId

export default router;
