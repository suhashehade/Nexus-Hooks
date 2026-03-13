import { Router } from "express";
import { webhookIngestionHandler } from "../controllers/webhookConrtoller.js";
import { validate } from "../middlewares/validate.js";
import { createWebhookSchema } from "../validation/webhook.schema.js";

const router = Router();

router.post(
  "/",
  validate(createWebhookSchema, "body"),
  webhookIngestionHandler,
);

export default router;
