import { Router } from "express";
import { getAllActionsHandler } from "../controllers/actionsController.js";

const router = Router();

router.get("/", getAllActionsHandler);

export default router;
