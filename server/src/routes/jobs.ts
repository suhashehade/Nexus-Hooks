import { Router } from "express";
import {
  getJobDetailsHandler,
  getJobsHandler,
} from "../controllers/jobsController.js";

const router = Router();

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs (optionally filtered by pipeline)
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: pipelineId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the pipeline to filter jobs by
 *     responses:
 *       200:
 *         description: List of all jobs (or jobs for specific pipeline)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
router.get("/", getJobsHandler);
/**
 * @swagger
 * /api/jobs/{jobId}:
 *   get:
 *     summary: Get job details
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the job
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobDetails'
 *       404:
 *         description: Job not found
 */
router.get("/:jobId", getJobDetailsHandler);

export default router;
