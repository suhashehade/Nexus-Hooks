import express from "express";
import healthRoute from "./routes/health.js";
import pipelinesRoutes from "./routes/pipelines.js";
import actionsRoutes from "./routes/actions.js";
import sourcesRoutes from "./routes/sources.js";
import subscribersRoutes from "./routes/subscribers.js";
import jobsRoutes from "./routes/jobs.js";
import webhooksRoute from "./routes/webhook.js";
import deliverRoute from "./routes/delivery.js";
import { errorHandlerMiddleware } from "./middlewares/handleErrors.js";

let swaggerUi, specs;
if (process.env.NODE_ENV !== "production") {
  try {
    const swaggerModule = await import("./swagger.js");
    swaggerUi = swaggerModule.swaggerUi;
    specs = swaggerModule.specs;
  } catch (error) {
    console.log("Swagger dependencies not available, skipping Swagger UI");
  }
}

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

app.get("/api-docs", (req, res) => {
  const apiDocs = {
    openapi: "3.0.0",
    info: {
      title: "Nexus API",
      version: "1.0.0",
      description: "Webhook processing and pipeline management system",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          tags: ["Health"],
          responses: {
            "200": {
              description: "Server is healthy",
            },
          },
        },
      },
      "/api/pipelines": {
        get: {
          summary: "Get all pipelines",
          tags: ["Pipelines"],
          responses: {
            "200": {
              description: "List of all pipelines",
            },
          },
        },
        post: {
          summary: "Create a new pipeline",
          tags: ["Pipelines"],
          responses: {
            "201": {
              description: "Pipeline created successfully",
            },
          },
        },
      },
      "/api/sources": {
        get: {
          summary: "Get all sources",
          tags: ["Sources"],
          responses: {
            "200": {
              description: "List of all sources",
            },
          },
        },
      },
      "/api/actions": {
        get: {
          summary: "Get all actions",
          tags: ["Actions"],
          responses: {
            "200": {
              description: "List of all actions",
            },
          },
        },
      },
      "/api/jobs": {
        get: {
          summary: "Get all jobs",
          tags: ["Jobs"],
          responses: {
            "200": {
              description: "List of all jobs",
            },
          },
        },
      },
    },
  };

  res.setHeader("Content-Type", "application/json");
  res.json(apiDocs);
});

if (process.env.NODE_ENV !== "production" && swaggerUi && specs) {
  app.use("/api-docs-ui", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("📚 Swagger UI available at: http://localhost:4000/api-docs-ui");
}

app.use(errorHandlerMiddleware);
