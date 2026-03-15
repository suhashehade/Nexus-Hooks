import { app } from "./app.js";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("server");
const PORT = 4000;

app.listen(PORT, () => {
  logger.success(`🚀 Nexus Server started successfully`, { port: PORT });
  logger.info(`📋 Available endpoints:`, {
    health: `http://localhost:${PORT}/health`,
    actions: `http://localhost:${PORT}/api/actions`,
    jobs: `http://localhost:${PORT}/api/jobs`,
    jobDetails: `http://localhost:${PORT}/api/jobs/details/{jobId}`,
    webhooks: `http://localhost:${PORT}/api/nexus/webhooks`,
  });
});
