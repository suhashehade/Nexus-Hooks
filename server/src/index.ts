import express from "express";
import healthRoute from "./routes/health.js";
import pipelinesRoutes from "./routes/pipelines.js";
import actionsRoutes from "./routes/actions.js";
import jobsRoutes from "./routes/jobs.js";
import webhooksRoute from "./routes/webhook.js";
import deliverRoute from "./routes/delivery.js";

import { errorHandlerMiddleware } from "./middlewares/handleErrors.js";
import { createLogger } from "./utils/logger.js";

const logger = createLogger('server');

const app = express();
app.use(express.json());
const PORT = 4000;

app.use("/app", express.static("./src/app"));

app.use("/health", healthRoute);
app.use("/api/pipelines", pipelinesRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/api/jobs", jobsRoutes);

app.use("/api/nexus/webhooks", webhooksRoute);
app.use("/internal/deliver", deliverRoute);

app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
  logger.success(`🚀 Nexus Server started successfully`, { port: PORT });
  logger.info(`📋 Available endpoints:`, {
    health: `http://localhost:${PORT}/health`,
    actions: `http://localhost:${PORT}/api/actions`,
    jobs: `http://localhost:${PORT}/api/jobs`,
    jobDetails: `http://localhost:${PORT}/api/jobs/details/{jobId}`,
    webhooks: `http://localhost:${PORT}/api/nexus/webhooks`
  });
});
