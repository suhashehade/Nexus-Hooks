import { describe, it, expect } from "vitest";
import { mergeDup } from "../actions/mergeDup";

describe("mergeDup action", () => {
  it("should merge duplicated items by name", async () => {
    const order = {
      items: [
        { id: 1, name: "tuna", price: 10, currency: "ILS" },
        { id: 2, name: "tuna", price: 12, currency: "ILS" },
        { id: 3, name: "cola", price: 5, currency: "ILS" },
      ],
    };

    const result = await mergeDup(order);

    expect(result.status).toBe("success");
    expect(result.order!.items!.length).toBe(2);

    const tuna = result.order!.items!.find((item: any) => item.name === "tuna");

    expect(tuna!.price).toBe(22);
  });

  it("should not change items if no duplicates exist", async () => {
    const order = {
      items: [
        { id: 1, name: "tuna", price: 10, currency: "ILS" },
        { id: 2, name: "cola", price: 5, currency: "ILS" },
      ],
    };

    const result = await mergeDup(order);

    expect(result.status).toBe("success");
    expect(result.order!.items!.length).toBe(2);
  });
});
