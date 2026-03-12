import express from "express";
const app = express();
app.use(express.json());
const PORT = 8081;
const handleMainJob = async (req, res, next) => {
    try {
        const { order } = req.body;
        res.status(200).json({ message: "hi, i'm accounting", order: req.body });
    }
    catch (error) { }
};
app.use("/app", express.static("./src/app"));
app.post("/api/subscribers/accounting", handleMainJob);
// app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
