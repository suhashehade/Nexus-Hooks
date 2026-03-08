import express from "express";
import { addPipelineHandler, deletePipelineHandler, getAllPipelinesHandler, getPipelineByIDHandler, } from "./app/api/pipelines.js";
import { errorHandlerMiddleware } from "./middlewares/handleErrors.js";
import { validate } from "./middlewares/validate.js";
import { createBodySchema, createParamsSchema, } from "./validation/pipeline.schema.js";
const app = express();
app.use(express.json());
const PORT = 8080;
app.use("/app", express.static("./src/app"));
const healthHandler = async (req, res, next) => {
    try {
        res.status(200).send({ message: "OK" });
    }
    catch (error) {
        next(error);
    }
};
app.get("/health", healthHandler);
app.post("/api/pipeline", validate(createBodySchema), addPipelineHandler);
app.get("/api/pipeline", getAllPipelinesHandler);
app.get("/api/pipeline/:pipelineId", validate(createParamsSchema, "params"), getPipelineByIDHandler);
app.delete("/api/pipeline/:pipelineId", validate(createParamsSchema, "params"), deletePipelineHandler);
app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
