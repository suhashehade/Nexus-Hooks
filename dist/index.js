import express from "express";
const app = express();
app.use(express.json());
const PORT = 8080;
app.use("/app", express.static("./src/app"));
const healthHandler = async (req, res) => {
    res.status(200).send({ message: "OK" });
};
app.get("/health", healthHandler);
// app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
