import { describe, it, expect } from "vitest";
import { recalculate } from "../actions/recalculate";
describe("recalculate", () => {
    it("should recalc totalPrice when config.totalPrice is true", async () => {
        const order = {
            id: 1,
            items: [
                { id: 1, name: "item1", price: 10 },
                { id: 2, name: "item2", price: 20 },
            ],
            totalPrice: 0,
            currency: "ILS",
            customer: { id: 1, name: "Ahmed", city: "Nablus" },
        };
        const action = {
            name: "recalculate",
            config: { totalPrice: true },
        };
        const result = await recalculate(order, action);
        expect(result.status).toBe("success");
        expect(result.order?.totalPrice).toBe(30);
    });
    it("should skip recalculation when config.totalPrice is false", async () => {
        const order = {
            id: 1,
            items: [
                { id: 1, name: "item1", price: 10 },
                { id: 2, name: "item2", price: 20 },
            ],
            totalPrice: 0,
            currency: "ILS",
            customer: { id: 1, name: "Ahmed", city: "Nablus" },
        };
        const action = {
            name: "recalculate",
            config: { totalPrice: false },
        };
        const result = await recalculate(order, action);
        expect(result.status).toBe("skipped");
        expect(result.reason).toBe("totalPrice recalc disabled");
    });
    it("should handle empty items gracefully", async () => {
        const order = {
            id: 1,
            items: [],
            totalPrice: 100,
            currency: "ILS",
            customer: { id: 1, name: "Ahmed", city: "Nablus" },
        };
        const action = {
            name: "recalculate",
            config: { totalPrice: true },
        };
        const result = await recalculate(order, action);
        expect(result.status).toBe("success");
        expect(result.order?.totalPrice).toBe(0);
    });
});
