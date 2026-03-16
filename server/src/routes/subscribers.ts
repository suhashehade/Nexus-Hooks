import { Router } from "express";
import { getAllSubscribersHandler } from "../controllers/subscibersController.js";

const router = Router();

router.get("/", getAllSubscribersHandler);

export default router;
