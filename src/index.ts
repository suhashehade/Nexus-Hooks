import express, { NextFunction, Request, Response } from "express";
const app = express();
app.use(express.json());
const PORT = 8080;
app.use("/app", express.static("./src/app"));
const healthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(200).send({ message: "OK" });
  } catch (error: any) {
    next(error);
  }
};

app.get("/health", healthHandler);
// app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
