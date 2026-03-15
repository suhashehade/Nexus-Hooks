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
        { id: 1, name: "tuna", price: 5, currency: "ILS" },
      ],
      totalPrice: 30,
      currency: "ILS",
    };

    const action: Action = {
      name: "mergeDup",
      config: { mergeBy: "id" },
    };

    const result = await mergeDup(order, action);

    expect(result.status).toBe("success");
    expect(result.order).toBeDefined();
    expect(result.order!.items).toHaveLength(2);

    const tuna = result.order!.items!.find((i) => i.id === 1)!;
    expect(tuna.price).toBe(15);

    const salmon = result.order!.items!.find((i) => i.id === 2)!;
    expect(salmon.price).toBe(15);
  });
});
