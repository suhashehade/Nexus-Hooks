import { randomBytes } from "crypto";

export const generatePipelineSecret = (length = 32) => {
  return randomBytes(length).toString("hex");
};
