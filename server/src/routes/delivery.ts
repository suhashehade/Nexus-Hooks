import { Router } from "express";
import { deliverHandler } from "../controllers/deliveringContoller.js";

const router = Router();

router.post("/", deliverHandler);

export default router;
