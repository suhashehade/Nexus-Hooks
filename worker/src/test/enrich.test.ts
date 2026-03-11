import { describe, it, expect } from "vitest";
import { enrich } from "../actions/enrich";

describe("enrich", () => {
  it("should calculate totalPriceWithTax for accounting", async () => {
    const order = {
      id: 1,
      subscriber: "accounting",
      totalPrice: 100,
      customer: { name: "Ali", city: "Nablus" },
    };

    const result = await enrich(order);

    expect(result.status).toBe("success");
    expect(result.order!.totalPriceWithTax).toBe(117);
  });

  it("should add shippingZone for shipping subscriber", async () => {
    const order = {
      id: 1,
      subscriber: "shipping",
      customer: { name: "Ali", city: "Nablus" },
    };

    const result = await enrich(order);

    expect(result.status).toBe("success");
    expect(result.order!.shippingZone).toBe("north");
  });

  it("should skip if subscriber unknown", async () => {
    const order = {
      id: 1,
      subscriber: "other",
    };

    const result = await enrich(order);

    expect(result.status).toBe("skipped");
  });
});
