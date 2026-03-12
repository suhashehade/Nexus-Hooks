import { describe, it, expect } from "vitest";
import { transform } from "../actions/transform";
import { Order } from "../lib/types/job";
import { Action } from "../lib/types/action";

describe("transform action", () => {
  const baseOrder: Order = {
    id: 1,
    totalPrice: 50,
    currency: "ILS",
    items: [{ id: 1, name: "tuna", price: 50 }],
    customer: { id: 1, name: "Ahmed", city: "Nablus" },
  } as Order;

  const action: Action = {
    name: "transform",
    config: {},
  };

  it("should transform order for accounting", async () => {
    const order: Order = {
      ...baseOrder,
      subscriber: { id: "1", name: "Accounting", url: "http://acc" },
    };

    const result = await transform(order, "pipeline1", "job1", action);

    expect(result.status).toBe("success");
    expect(result.order?.totalPrice).toBe(50);
    expect(result.order?.items).toBeDefined();
    expect(result.order?.customer).toBeDefined();
  });

  it("should transform order for shipping", async () => {
    const order: Order = {
      ...baseOrder,
      subscriber: { id: "2", name: "Shipping", url: "http://ship" },
    };

    const result = await transform(order, "pipeline1", "job1", action);

    expect(result.status).toBe("success");
    expect(result.order?.customer).toBeDefined();
    expect(result.order?.items).toBeUndefined();
    expect(result.order?.totalPrice).toBeUndefined();
  });

  it("should skip if no subscriber", async () => {
    const order: Order = { ...baseOrder };

    const result = await transform(order, "pipeline1", "job1", action);

    expect(result.status).toBe("skipped");
    expect(result.reason).toBe("no subscriber");
  });

  it("should skip unknown subscriber", async () => {
    const order: Order = {
      ...baseOrder,
      subscriber: { id: "3", name: "Marketing", url: "http://mkt" },
    };

    const result = await transform(order, "pipeline1", "job1", action);

    expect(result.status).toBe("skipped");
    expect(result.reason).toBe("unknown subscriber");
  });
});
