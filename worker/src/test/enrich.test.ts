import { describe, it, expect } from "vitest";
import { enrich } from "../actions/enrich";
import { Order } from "../lib/types/job";
import { Action } from "../lib/types/action";

describe("enrich action", () => {
  const baseOrder: Order = {
    id: 1,
    currency: "ILS",
    items: [{ id: 1, name: "tuna", price: 50 }],
    totalPrice: 50,
    customer: {
      id: 1,
      name: "Ahmed",
      city: "Nablus",
    },
  } as Order;

  const action: Action = {
    name: "enrich",
    config: {},
  };

  it("should add totalPriceWithTax for accounting subscriber", async () => {
    const order: Order = {
      ...baseOrder,
      subscriber: { id: "1", name: "Accounting", url: "http://acc" },
    };

    const result = await enrich(order, "pipeline1", "job1", action);

    expect(result.status).toBe("success");
    expect(result.order?.totalPriceWithTax).toBe(58.5);
  });

  it("should skip accounting if totalPrice is missing", async () => {
    const order: Order = {
      ...baseOrder,
      totalPrice: undefined as any,
      subscriber: { id: "1", name: "Accounting", url: "http://acc" },
    };

    const result = await enrich(order, "pipeline1", "job1", action);

    expect(result.status).toBe("skipped");
    expect(result.reason).toBe("missing totalPrice");
  });

  it("should add shippingZone for shipping subscriber", async () => {
    const order: Order = {
      ...baseOrder,
      customer: { ...baseOrder.customer, city: "Ramallah" },
      subscriber: { id: "2", name: "Shipping", url: "http://ship" },
    };

    const result = await enrich(order, "pipeline1", "job1", action);

    expect(result.status).toBe("success");
    expect(result.order?.shippingZone).toBe("center");
  });

  it("should skip if no subscriber", async () => {
    const order: Order = { ...baseOrder };

    const result = await enrich(order, "pipeline1", "job1", action);

    expect(result.status).toBe("skipped");
    expect(result.reason).toBe("no subscriber");
  });

  it("should skip unknown subscriber", async () => {
    const order: Order = {
      ...baseOrder,
      subscriber: { id: "3", name: "Marketing", url: "http://mkt" },
    };

    const result = await enrich(order, "pipeline1", "job1", action);

    expect(result.status).toBe("skipped");
    expect(result.reason).toBe("unknown subscriber");
  });
});
