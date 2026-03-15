import { describe, it, expect } from "vitest";
import { enrich } from "../actions/enrich.js";
describe("enrich action", () => {
    it("should enrich order for accounting subscriber", async () => {
        const mockOrder = {
            id: "order-1",
            totalPrice: 100,
            customer: { name: "John Doe" },
            subscriber: { id: "1", name: "accounting", url: "http://accounting" },
        };
        const result = await enrich(mockOrder);
        expect(result.status).toBe("success");
        expect(result.order?.totalPriceWithTax).toBe(117);
    });
    it("should skip order for non-accounting subscriber", async () => {
        const mockOrder = {
            id: "order-1",
            totalPrice: 100,
            customer: { name: "John Doe" },
            subscriber: { id: "2", name: "shipping", url: "http://shipping" },
        };
        const result = await enrich(mockOrder);
        expect(result.order?.shippingZone).toBeDefined();
    });
});
