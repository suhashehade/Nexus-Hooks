import { describe, it, expect } from "vitest";
import { runJob } from "../executor";

describe("runJob pipeline", () => {
  it("should process order through pipeline", async () => {
    const mockJob: any = {
      id: "job1",
      payload: {
        id: 1,
        items: [
          { id: 1, name: "tuna", price: 12 },
          { id: 1, name: "tuna", price: 8 },
        ],
        currency: "ILS",
        totalPrice: 20,
        customer: {
          name: "Ahmed",
          city: "Nablus",
          phoneNumber: "0599876543",
        },
      },
    };

    const mockPipeline: any = {
      id: "pipeline1",
      subscribers: [
        { name: "Accounting", url: "http://acc" },
        { name: "Shipping", url: "http://ship" },
      ],
      actions: [
        { name: "mergeDup", config: { mergeBy: "id" } },
        { name: "filter", config: { totalPrice: true, minPrice: 10 } },
        { name: "normalize", config: { prefixes: ["+970", "+972"] } },
        { name: "recalculate", config: { totalPrice: true } },
        { name: "fork", config: {} },
        { name: "transform", config: {} },
        { name: "enrich", config: {} },
        { name: "route", config: {} },
      ],
    };

    const result = await runJob(mockJob, mockPipeline);

    expect(result.length).toBe(2);

    expect(result[0]?.customer?.phoneNumber!.startsWith("+970")).toBe(true);

    expect(result[0].subscriber).toBeDefined();
  });
});
