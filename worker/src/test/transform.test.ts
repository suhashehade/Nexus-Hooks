import { describe, it, expect } from "vitest";
import { transform } from "../actions/transform";

describe("transform", () => {
  it("should keep only accounting fields", async () => {
    const order = {
      id: 1,
      subscriber: "accounting",
      totalPrice: 100,
      currency: "ILS",
      items: [{ price: 100 }],
      customer: { name: "Ali" },
      extraFeild: "kjkhkh",
    };

    const result = await transform(order);

    expect(result.status).toBe("success");
    expect(result.order!.totalPrice).toBe(100);
    expect(result.order!.currency).toBe("ILS");
    expect(result.order!.customer!.name).toBe("Ali");
    expect(result.order!.extraField).toBeUndefined();
  });

  it("should keep only shipping fields", async () => {
    const order = {
      id: 1,
      subscriber: "shipping",
      totalPrice: 100,
      currency: "ILS",
      items: [{ price: 100 }],
      customer: { name: "Ali" },
      extraField: "fg",
    };

    const result = await transform(order);

    expect(result.status).toBe("success");
    expect(result.order!.customer!.name).toBe("Ali");
    expect(result.order!.totalPrice).toBeUndefined();
    expect(result.order!.extraField).toBeUndefined();
  });
});
