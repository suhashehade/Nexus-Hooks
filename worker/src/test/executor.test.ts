// worker/src/test/executor.test.ts
import { describe, it, expect } from "vitest";
import { runJob } from "../executor";

describe("Executor", () => {
  it("should process job through all actions and produce one order per subscriber", async () => {
    const mockJob = {
      id: "17a81e5d-ae3d-48ec-84fe-806876c10765",
      pipelineId: "6a73df67-a2d8-431e-b85f-926af1012930",
      payload: {
        id: 1,
        items: [{ id: 1, name: "tuna", price: 12, currency: "ILS" }],
        currency: "ILS",
        customer: {
          id: 1,
          city: "Nablus",
          name: "Ahmed",
          latitude: 32,
          longitude: 32,
          phoneNumber: "0599876543",
        },
        totalPrice: 12,
      },
      status: "pending",
      attempts: 0,
    };

    const mockSubscribers = [
      {
        id: "e91e4e7c-9810-4cc7-a433-e612fabcda78",
        name: "Accounting",
        url: "http://localhost:8081/api/subscribers/accounting",
      },
      {
        id: "b6620bbb-a067-487a-86da-fee37f93b893",
        name: "Shipping",
        url: "http://localhost:8082/api/subscribers/shipping",
      },
    ];

    const result = await runJob(mockJob, mockSubscribers);

    // نتأكد إنه فيه نسخة لكل subscriber
    expect(result.length).toBe(mockSubscribers.length);

    // نتأكد إنه كل نسخة مرتبطة بالsubscriber الصحيح
    expect(result.map((o) => o.subscriber).sort()).toEqual([
      "Accounting",
      "Shipping",
    ]);

    // نتأكد إنه totalPrice بعد recalcTotalPrice مضبوط
    result.forEach((order) => {
      const sumItems = order.items.reduce(
        (sum: number, item: any) => sum + item.price,
        0,
      );
      expect(order.totalPrice).toBe(sumItems);
    });

    // نتأكد إنه normalize عدل رقم الهاتف
    result.forEach((order) => {
      expect(
        order.customer.phoneNumber.startsWith("+970") ||
          order.customer.phoneNumber.startsWith("+972"),
      ).toBe(true);
    });

    // نتأكد إنه transform شال بيانات ما تلزم كل subscriber
    result.forEach((order) => {
      if (order.subscriber.name === "Shipping") {
        expect(order.totalPrice).toBeUndefined(); // shipping مش محتاج totalPrice
      }
      if (order.subscriber.name === "Accounting") {
        expect(order.totalPrice).toBeDefined(); // accounting لازم totalPrice
      }
    });

    // ممكن نضيف اختبار enrich و routing كـ mock لو حابين
  });
});
