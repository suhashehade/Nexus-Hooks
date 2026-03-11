import { normalizePhone } from "../actions/normalizePhone";
import { describe, it, expect } from "vitest";
import { Order } from "../lib/types/job";

describe("normalizePhone", () => {
  it("should format Israeli fixed lines with +972", async () => {
    const order: Order = { customer: { phoneNumber: "021234567" } };
    const result = await normalizePhone(order);
    expect(result.status).toBe("success");
    expect(result.order!.customer!.phoneNumber).toBe("+97221234567");
  });

  it("should default to +972 if start with 8", async () => {
    const order: Order = { customer: { phoneNumber: "8888888" } };
    const result = await normalizePhone(order);
    expect(result.status).toBe("success");
    expect(result.order!.customer!.phoneNumber).toBe("+9728888888");
  });

  it("should default to +970 if unknown pattern", async () => {
    const order: Order = { customer: { phoneNumber: "5555555" } };
    const result = await normalizePhone(order);
    expect(result.status).toBe("success");
    expect(result.order!.customer!.phoneNumber).toBe("+9705555555");
  });

  it("should remove spaces and leading zero", async () => {
    const order: Order = { customer: { phoneNumber: " 059 987 6543 " } };
    const result = await normalizePhone(order);
    expect(result.status).toBe("success");
    expect(result.order!.customer!.phoneNumber).toBe("+970599876543");
  });
});
