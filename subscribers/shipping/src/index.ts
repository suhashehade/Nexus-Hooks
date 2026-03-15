import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

const checkHealth = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "hi, i'm shipping" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const PORT = 5002;
const handleMainJob = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "hi, i'm shipping", order: req.body });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
app.use("/app", express.static("./src/app"));
app.get("/", checkHealth);
app.post("/api/subscribers/shipping", handleMainJob);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
