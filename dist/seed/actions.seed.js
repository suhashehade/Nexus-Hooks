import { createAction } from "../db/queries/actions.js";
import { randomUUID } from "crypto";
export async function seedActions() {
    const actionsList = [
        {
            type: "rateLimit",
            order: 1,
            editable: false,
            required: false,
            description: "Skip scamed orders '1+ order by the same customer per minute'",
            config: { limitPerMinute: 1 },
        },
        {
            type: "filterStructure",
            order: 2,
            editable: false,
            required: true,
            description: "Skip orders that haven't phone number, city, price, items list, longitude, or latitude",
            config: {
                requiredFields: [
                    "phoneNumber",
                    "city",
                    "longitude",
                    "latitude",
                    "price",
                    "items",
                ],
                requireItems: true,
            },
        },
        {
            type: "dedup",
            order: 3,
            editable: false,
            required: false,
            description: "Merge order items that have the same item id and item name",
            config: {
                by: ["itemId", "name"],
                strategy: "merge",
            },
        },
        {
            type: "filter",
            order: 4,
            editable: true,
            required: true,
            description: "Filter order by total price have minimum custom value (by default: 20)",
            config: { minPrice: 20 },
        },
        {
            type: "normalize",
            order: 5,
            editable: true,
            required: false,
            description: "Normalize phone number to customized country and normalize the city name",
            config: { phoneFormat: "palestine", cityCase: "capitalize" },
        },
        {
            type: "validate",
            order: 6,
            editable: false,
            required: true,
            description: "Check the total price is calculated correctly",
            config: { checkTotalPrice: true },
        },
        {
            type: "labeling",
            order: 7,
            editable: false,
            required: true,
            description: "Add label to the order by subscriber name",
            config: { bySubscriber: true },
        },
        {
            type: "transform",
            order: 8,
            editable: false,
            required: true,
            description: "Remove unnecessary fields per subscriber need",
            config: { removeUnnecessaryFields: true },
        },
        {
            type: "enrich",
            order: 9,
            editable: false,
            required: true,
            description: "Add additional fields per subscriber need",
            config: {
                shipping: { addZoneFromCity: true },
                accounting: { addTax: true },
            },
        },
        {
            type: "routing",
            order: 10,
            editable: false,
            required: true,
            description: "Send the order for the subscribers",
            config: { method: "webhook" },
        },
    ];
    for (const action of actionsList) {
        await createAction({
            id: randomUUID(),
            ...action,
        });
    }
    console.log("✅ actions seeded");
}
