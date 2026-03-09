import { Router } from "express";
import { webhookIngestionHandler } from "../controllers/webhookConrtoller.js";

const router = Router();

router.post("/sources/:sourceName", webhookIngestionHandler); // :sourceId

export default router;
