import { Router } from "express";
import { getAllSourcesHandler } from "../controllers/sourcesController.js";

const router = Router();

router.get("/", getAllSourcesHandler);

export default router;
