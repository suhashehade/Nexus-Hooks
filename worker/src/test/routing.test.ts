import { describe, it, expect, vi } from "vitest";
import { route } from "../actions/routing";

// نعمل spy على console.log بدل إرسال فعلي
vi.spyOn(console, "log").mockImplementation(() => {});

describe("route", () => {
  it("should send order to accounting subscriber", async () => {
    const order = {
      id: 1,
      subscriber: "accounting",
    };

    const result = await route(order);

    expect(result.status).toBe("success");
  });

  it("should skip order if subscriber missing", async () => {
    const order = {
      id: 1,
    };

    const result = await route(order);

    expect(result.status).toBe("skipped");
    expect(result.reason).toBe("no subscriber");
  });

  it("should fail if webhook call fails", async () => {
    // نعمل mock للwebhook ليرجع false
    const order = {
      id: 1,
      subscriber: "shipping",
    };

    const original = vi.spyOn(global.console, "log");
    vi.mocked(original).mockImplementationOnce(() => {
      throw new Error("fail call");
    });

    const result = await route(order);

    expect(result.status).toBe("failed");
    expect(result.reason).toBe("route error");
  });
});
