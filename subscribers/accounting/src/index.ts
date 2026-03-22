import express, { Request, Response } from "express";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("accounting");

const app = express();
app.use(express.json());
const PORT = 5001;

const checkHealth = async (req: Request, res: Response) => {
  try {
    logger.info("💓 Health check requested");
    res.status(200).json({ message: "hi, i'm accounting" });
  } catch (error) {
    logger.error("❌ Health check failed", { error: (error as Error).message });
    res.status(500).json({ error: (error as Error).message });
  }
};

const handleMainJob = async (req: Request, res: Response) => {
  try {
    const { order } = req.body;

    logger.info("📊 Processing accounting job", {
      orderId: order?.id,
      customer: order?.customer?.name,
      totalPrice: order?.totalPrice,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    logger.success("✅ Accounting job completed", { orderId: order?.id });
    res.status(200).json({ message: "hi, i'm accounting", order: req.body });
  } catch (error) {
    logger.error("❌ Accounting job failed", {
      error: (error as Error).message,
    });
    res.status(500).json({ error: (error as Error).message });
  }
};
app.use("/app", express.static("./src/app"));
app.get("/", checkHealth);
app.post("/api/subscribers/accounting", handleMainJob);

app.listen(PORT, () => {
  logger.success(`🚀 Accounting subscriber started`, { port: PORT });
});
