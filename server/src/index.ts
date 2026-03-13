import express from "express";
import healthRoute from "./routes/health.js";
import pipelinesRoutes from "./routes/pipelines.js";
import actionsRoutes from "./routes/actions.js";
import webhooksRoute from "./routes/webhook.js";
import deliverRoute from "./routes/delivery.js";

import { errorHandlerMiddleware } from "./middlewares/handleErrors.js";

const app = express();
app.use(express.json());
const PORT = 4000;

app.use("/app", express.static("./src/app"));

app.use("/health", healthRoute);
app.use("/api/pipelines", pipelinesRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/api/nexus/webhooks", webhooksRoute);
app.use("/internal/deliver", deliverRoute);

app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
