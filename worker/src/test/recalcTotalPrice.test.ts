import { describe, it, expect } from "vitest";
import { recalculateTotalPrice } from "../actions/recalcTotalPrice";
import { Order } from "../lib/types/job";

describe("recalculatePrice", () => {
  it("should succeed if totalPrice matches sum of items", async () => {
    const order: Order = {
      items: [
        { id: 1, name: "Tuna", price: 12, currency: "ILS" },
        { id: 2, name: "Salad", price: 8, currency: "ILS" },
      ],
      totalPrice: 20,
      currency: "ILS",
    };
    const result = await recalculateTotalPrice(order);
    expect(result.status).toBe("success");
    expect(result.order!.totalPrice).toBe(20);
  });

  it("should correct totalPrice if mismatch", async () => {
    const order: Order = {
      items: [
        { id: 1, name: "Tuna", price: 12, currency: "ILS" },
        { id: 2, name: "Salad", price: 8, currency: "ILS" },
      ],
      totalPrice: 25,
      currency: "ILS",
    };
    const result = await recalculateTotalPrice(order);
    expect(result.status).toBe("success");
    expect(result.order!.totalPrice).toBe(20);
  });
});
