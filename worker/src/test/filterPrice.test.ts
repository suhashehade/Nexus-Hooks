import { describe, it, expect } from "vitest";
import { filterPrice } from "../actions/filterPrice";

describe("filterPrice action", () => {
  it("should pass when price >= minPrice", async () => {
    const order = {
      totalPrice: 30,
    };

    const result = await filterPrice(order, { minPrice: 20 });

    expect(result.status).toBe("success");
  });

  it("should filter order when price < minPrice", async () => {
    const order = {
      totalPrice: 10,
    };

    const result = await filterPrice(order, { minPrice: 20 });
    expect(result.status).toBe("skipped");
  });
});
