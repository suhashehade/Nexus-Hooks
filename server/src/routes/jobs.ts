import { Router } from "express";
import {
  getJobDetailsHandler,
  getJobsHandler,
} from "../controllers/jobsController.js";

const router = Router();

router.get("/", getJobsHandler);
router.get("/:jobId", getJobDetailsHandler);

export default router;
