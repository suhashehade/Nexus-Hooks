import { Router } from "express";
import { healthHandler } from "../controllers/healthController.js";

const router = Router();

router.get("/health", healthHandler);

export default router;
