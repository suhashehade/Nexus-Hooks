import { describe, it, expect } from "vitest";
import { fork } from "../actions/fork";
describe("fork", () => {
    const mockOrder = {
        id: 1,
        items: [{ id: 1, name: "tuna", price: 12 }],
        totalPrice: 12,
        currency: "ILS",
        customer: { id: 1, name: "Ahmed", city: "Nablus" },
    };
    const subscribers = [
        { id: "sub1", name: "Accounting", url: "http://accounting" },
        { id: "sub2", name: "Shipping", url: "http://shipping" },
    ];
    it("should fork the order for each subscriber", async () => {
        const result = await fork(mockOrder, { subscribers });
        expect(result.status).toBe("success");
        expect(result.orders).toHaveLength(subscribers.length);
        expect(result.orders[0].subscriber).toEqual(subscribers[0]);
        expect(result.orders[1].subscriber).toEqual(subscribers[1]);
        // Ensure original order is not mutated
        expect(mockOrder.subscriber).toBeUndefined();
    });
    it("should skip if no subscribers provided", async () => {
        const result = await fork(mockOrder, { subscribers: [] });
        expect(result.status).toBe("skipped");
        expect(result.reason).toBe("no subscribers");
        expect(result.orders).toHaveLength(1);
        expect(result.orders[0]).toEqual(mockOrder);
    });
});
