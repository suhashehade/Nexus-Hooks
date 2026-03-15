import { describe, it, expect } from "vitest";
import { normalize } from "../actions/normalize";
describe("normalize", () => {
    const baseOrder = {
        id: 1,
        items: [{ id: 1, name: "item1", price: 10, currency: "ILS" }],
        currency: "ILS",
        customer: {
            id: 1,
            name: "Ahmed",
            city: "Nablus",
            latitude: 32,
            longitude: 32,
            phoneNumber: "",
        },
        totalPrice: 10,
    };
    it("should normalize Palestinian phone starting with 0", async () => {
        const order = {
            ...baseOrder,
            customer: { ...baseOrder.customer, phoneNumber: "0591234567" },
        };
        const action = {
            name: "normalize",
            config: { phone: true, prefixes: ["+970", "+972"] },
        };
        const result = await normalize(order, action);
        expect(result.status).toBe("success");
        expect(result.order?.customer?.phoneNumber).toBe("+970591234567");
    });
    it("should normalize Israeli phone starting with 0 and first digit 3", async () => {
        const order = {
            ...baseOrder,
            customer: { ...baseOrder.customer, phoneNumber: "031234567" },
        };
        const action = {
            name: "normalize",
            config: { phone: true, prefixes: ["+970", "+972"] },
        };
        const result = await normalize(order, action);
        expect(result.status).toBe("success");
        expect(result.order?.customer?.phoneNumber).toBe("+97031234567");
    });
    it("should skip if phone number is missing", async () => {
        const order = {
            ...baseOrder,
            customer: { ...baseOrder.customer, phoneNumber: "" },
        };
        const action = {
            name: "normalize",
            config: { prefixes: ["+970", "+972"] },
        };
        const result = await normalize(order, action);
        expect(result.status).toBe("skipped");
        expect(result.reason).toBe("no phone number");
    });
    it("should skip if pattern does not match", async () => {
        const order = {
            ...baseOrder,
            customer: { ...baseOrder.customer, phoneNumber: "111234567" },
        };
        const action = {
            name: "normalize",
            config: { prefixes: ["+972"] },
        };
        const result = await normalize(order, action);
        expect(result.status).toBe("skipped");
        expect(result.reason).toBe("unknown pattern");
    });
});
