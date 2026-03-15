import express, { NextFunction, Request, Response } from "express";
import { createLogger } from "./utils/logger.js";

const logger = createLogger('accounting');

const app = express();
app.use(express.json());
const PORT = 5001;

const checkHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('💓 Health check requested');
    res.status(200).json({ message: "hi, i'm accounting" });
  } catch (error: any) {
    logger.error('❌ Health check failed', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

const handleMainJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { order } = req.body;
    
    logger.info('📊 Processing accounting job', { 
      orderId: order?.id, 
      customer: order?.customer?.name,
      totalPrice: order?.totalPrice 
    });
    
    // Simulate accounting processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    logger.success('✅ Accounting job completed', { orderId: order?.id });
    res.status(200).json({ message: "hi, i'm accounting", order: req.body });
  } catch (error: any) {
    logger.error('❌ Accounting job failed', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
app.use("/app", express.static("./src/app"));
app.get("/", checkHealth);
app.post("/api/subscribers/accounting", handleMainJob);

app.listen(PORT, () => {
  logger.success(`🚀 Accounting subscriber started`, { port: PORT });
});
