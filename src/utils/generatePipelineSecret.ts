import { randomBytes } from "crypto";

export function generatePipelineSecret(length = 32) {
  return randomBytes(length).toString("hex");
}
