import { createAction } from "../queries/actions.js";
import { randomUUID } from "crypto";

export async function seedActions() {
  const actionsList = [
    {
      type: "filterStructure",
      order: 1,
      editable: false,
      required: true,
      description:
        "Skip orders that haven't phone number, longitude, latitude or city for the customer, items list and each item's price, or the total price",
      config: {
        requiredFields: [
          "phoneNumber",
          "city",
          "longitude",
          "latitude",
          "price",
          "totalPrice",
          "items",
        ],
        requireItems: true,
      },
    },
    {
      type: "dedup",
      order: 2,
      editable: false,
      required: false,
      description: "Merge order items that have the same item id and item name",
      config: {
        by: ["id", "name"],
        strategy: "merge",
      },
    },
    {
      type: "filter",
      order: 3,
      editable: true,
      required: true,
      description: "Filter order by price = 10",
      config: { minPrice: 10 },
    },
    {
      type: "normalize",
      order: 4,
      editable: true,
      required: false,
      description:
        "Add Palestinian code to phone number and capitalize the city name",
      config: { phoneFormat: "palestine", cityCase: "capitalize" },
    },
    {
      type: "validate",
      order: 5,
      editable: false,
      required: true,
      description: "Check the total price is calculated correctly",
      config: { checkTotalPrice: true },
    },
    {
      type: "labeling",
      order: 6,
      editable: false,
      required: true,
      description: "Add label to the order by subscriber name",
      config: { bySubscriber: true },
    },
    {
      type: "transform",
      order: 7,
      editable: false,
      required: true,
      description: "Remove unnecessary fields per subscriber need",
      config: { removeUnnecessaryFields: true },
    },
    {
      type: "enrich",
      order: 8,
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
      order: 9,
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
