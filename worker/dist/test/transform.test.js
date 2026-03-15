import { describe, it, expect } from "vitest";
import { transform } from "../actions/transform.js";
describe("transform action", () => {
    it("should transform order for accounting subscriber", async () => {
        const order = {
            id: "order-1",
            totalPrice: 50,
            currency: "ILS",
            items: [{ id: 1, name: "tuna", price: 50 }],
            customer: { id: 1, name: "Ahmed", city: "Nablus" },
            subscriber: { id: "1", name: "Accounting", url: "http://acc" },
        };
        const result = await transform(order);
        expect(result.status).toBe("success");
        expect(result.order?.totalPrice).toBe(100); // 50 * 2
    });
    it("should transform order for shipping subscriber", async () => {
        const order = {
            id: "order-2",
            totalPrice: 30,
            currency: "ILS",
            items: [{ id: 1, name: "salmon", price: 30 }],
            customer: { id: 2, name: "Sara", city: "Ramallah" },
            subscriber: { id: "2", name: "Shipping", url: "http://ship" },
        };
        const result = await transform(order);
        expect(result.status).toBe("success");
        expect(result.order?.totalPrice).toBeUndefined();
    });
    it("should skip if no subscriber", async () => {
        const order = {
            id: "order-3",
            totalPrice: 25,
            currency: "ILS",
            items: [{ id: 1, name: "chicken", price: 25 }],
            customer: { id: 3, name: "Mohammed", city: "Gaza" },
        };
        const result = await transform(order);
        expect(result.status).toBe("skipped");
        expect(result.reason).toBe("no subscriber");
    });
    it("should skip for unknown subscriber", async () => {
        const order = {
            id: "order-4",
            totalPrice: 40,
            currency: "ILS",
            items: [{ id: 1, name: "beef", price: 40 }],
            customer: { id: 4, name: "Khalid", city: "Jerusalem" },
            subscriber: { id: "3", name: "Marketing", url: "http://mkt" },
        };
        const result = await transform(order);
        expect(result.status).toBe("skipped");
        expect(result.reason).toBe("unknown subscriber");
    });
});
