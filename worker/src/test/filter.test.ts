import { describe, it, expect } from "vitest";
import { filter } from "../actions/filter";
import { Action } from "../lib/types/action";
import { Order } from "../lib/types/job";

describe("filter action", () => {
  it("should skip orders below minPrice", async () => {
    const order = { id: 1, totalPrice: 15 };
    const action: Action = {
      name: "filter",
      config: { price: true, minPrice: 20 },
    };

    const result = await filter(order, action);

    expect(result.status).toBe("skipped");
    expect(result.reason).toBe("Order price 15 is less than minimum 20");
    expect(result.order).toBeUndefined();
  });

  it("should pass orders meeting minPrice", async () => {
    const order: Order = { id: 2, totalPrice: 25 };
    const action: Action = {
      name: "filter",
      config: { price: true, minPrice: 10 },
    };

    const result = await filter(order, action);

    expect(result.status).toBe("success");
    expect(result.order).toEqual(order);
  });
});
