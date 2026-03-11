import { describe, it, expect } from "vitest";
import { fork } from "../actions/fork";

describe("fork", () => {
  it("should create one order per subscriber", async () => {
    const order = {
      id: 1,
      totalPrice: 100,
    };

    const config = {
      subscribers: ["accounting", "shipping"],
    };

    const result = await fork(order, config);

    expect(result.status).toBe("success");
    expect(result.orders).toHaveLength(2);

    expect(result.orders[0].subscriber).toBe("accounting");
    expect(result.orders[1].subscriber).toBe("shipping");
  });

  it("should clone the order for each subscriber", async () => {
    const order = {
      id: 1,
      totalPrice: 100,
    };

    const config = {
      subscribers: ["accounting", "shipping"],
    };

    const result = await fork(order, config);

    expect(result.orders[0].id).toBe(1);
    expect(result.orders[1].id).toBe(1);
  });

  it("should skip if no subscribers", async () => {
    const order = {
      id: 1,
    };

    const config = {
      subscribers: [],
    };

    const result = await fork(order, config);

    expect(result.status).toBe("skipped");
    expect(result.orders).toHaveLength(1);
    expect(result.orders[0].id).toBe(1);
  });

  it("each order should have only one subscriber", async () => {
    const order = {
      id: 1,
    };

    const config = {
      subscribers: ["accounting", "shipping"],
    };

    const result = await fork(order, config);

    expect(result.orders[0].subscriber).not.toBe(result.orders[1].subscriber);
  });
});
