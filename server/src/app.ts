import express from "express";
import healthRoute from "./routes/health.js";
import pipelinesRoutes from "./routes/pipelines.js";
import actionsRoutes from "./routes/actions.js";
import sourcesRoutes from "./routes/sources.js";
import subscribersRoutes from "./routes/sources.js";
import jobsRoutes from "./routes/jobs.js";
import webhooksRoute from "./routes/webhook.js";
import deliverRoute from "./routes/delivery.js";
import { errorHandlerMiddleware } from "./middlewares/handleErrors.js";

export const app = express();

app.use(express.json());

app.use("/app", express.static("./src/app"));

app.use("/", healthRoute);
app.use("/api/pipelines", pipelinesRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/api/sources", sourcesRoutes);
app.use("/api/subscribers", subscribersRoutes);
app.use("/api/jobs", jobsRoutes);

app.use("/api/nexus/webhooks", webhooksRoute);
app.use("/internal/deliver", deliverRoute);

app.use(errorHandlerMiddleware);
