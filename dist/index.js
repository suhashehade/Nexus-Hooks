import express from "express";
import healthRoute from "./routes/health.js";
import pipelineRoutes from "./routes/pipelines.js";
import { errorHandlerMiddleware } from "./middlewares/handleErrors.js";
const app = express();
app.use(express.json());
const PORT = 8080;
app.use("/app", express.static("./src/app"));
app.get("/health", healthRoute);
app.use("/api/pipeline", pipelineRoutes);
app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
