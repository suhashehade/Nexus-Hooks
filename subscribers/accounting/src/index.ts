import express, { NextFunction, Request, Response } from "express";

const app = express();
app.use(express.json());
const PORT = 8081;
const handleMainJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { order } = req.body;
    res.status(200).json({ message: "hi, i'm accounting", order: req.body });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
app.use("/app", express.static("./src/app"));
app.post("/api/subscribers/accounting", handleMainJob);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
