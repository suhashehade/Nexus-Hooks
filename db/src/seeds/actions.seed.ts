import { createAction } from "../queries/actions.js";
import { randomUUID } from "crypto";

export async function seedActions() {
  const actionsList = [
    {
      type: "mergeDup",
      order: 1,
      editable: false,
      required: false,
      description: "Merge duplicated order items by [key], e.g.: id",
      config: {
        mergeBy: "id",
      },
    },
    {
      type: "filter",
      order: 2,
      editable: false,
      required: false,
      description:
        "Filter orders by [key] > || < || = [value], e.g.: price > 10",
      config: {
        price: true,
        minPrice: 10,
      },
    },
    {
      type: "normalize",
      order: 3,
      editable: false,
      required: false,
      description:
        "Normalize [key]: [value] => [key]: [normalizedValue], e.g.: phoneNumber: '0599876543' => normalize => phoneNumber: '+970599876543'",
      config: { phoneNumber: true, prefixes: ["+970", "+972"] },
    },
    {
      type: "recalculate",
      order: 4,
      editable: true,
      required: false,
      description:
        "Retry to calculate [key]: [value] to be ensure that calculated correctly, e.g.: totalPrice = sum(items.price)",
      config: { totalPrice: true },
    },
    {
      type: "fork",
      order: 5,
      editable: false,
      required: true,
      description: "Label the orders by the subscriber",
      config: {},
    },
    {
      type: "transform",
      order: 6,
      editable: false,
      required: true,
      description: "Remove unnecessary fields per subscriber need",
      config: {},
    },
    {
      type: "enrich",
      order: 7,
      editable: false,
      required: true,
      description: "Add additional fields per subscriber need",
      config: {
        shipping: { addZoneFromCity: true },
        accounting: { addTax: true },
      },
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
