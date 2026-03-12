import { describe, it, expect } from "vitest";
import { mergeDup } from "../actions/mergeDup";
import { Order, OrderItem } from "../lib/types/job";
import { Action } from "../lib/types/action";

describe("mergeDup action", () => {
  it("should merge items with the same key", async () => {
    const order: Order = {
      id: 1,
      items: [
        { id: 1, name: "tuna", price: 10, currency: "ILS" },
        { id: 2, name: "salmon", price: 15, currency: "ILS" },
        { id: 3, name: "tuna", price: 5, currency: "ILS" },
      ],
      totalPrice: 30,
      currency: "ILS",
    };

    const action: Action = {
      name: "mergeDup",
      config: { mergeBy: "name" }, // دمج حسب الاسم
    };

    const result = await mergeDup(order, "pipeline1", "job1", action);

    expect(result.status).toBe("success");
    expect(result.order).toBeDefined();
    expect(result.order!.items).toHaveLength(2); // tuna و salmon فقط

    const tuna = result.order!.items!.find((i) => i.name === "tuna")!;
    expect(tuna.price).toBe(15); // 10 + 5 = 15

    const salmon = result.order!.items!.find((i) => i.name === "salmon")!;
    expect(salmon.price).toBe(15);
  });

  it("should return failed status on error", async () => {
    const order: Order = {
      id: 2,
      items: null as any, // خطأ متعمد
      totalPrice: 0,
      currency: "ILS",
    };

    const action: Action = {
      name: "mergeDup",
      config: { mergeBy: "name" },
    };

    const result = await mergeDup(order, "pipeline1", "job1", action);

    expect(result.status).toBe("failed");
    expect(result.error).toBeDefined();
  });
});
