import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { OrderPipeline, getSentNotifications, resetSentNotifications } from "../src/orderPipeline.js";

describe("OrderPipeline", () => {
  beforeEach(() => resetSentNotifications());

  it("sends mock emails for each lifecycle step", () => {
    const pipeline = new OrderPipeline();
    const order = { id: "o1", email: "ada@example.com" };
    pipeline.advance(order, "created");
    pipeline.advance(order, "paid");
    pipeline.advance(order, "shipped");
    assert.deepEqual(getSentNotifications(), [
      { step: "created", orderId: "o1", email: "ada@example.com" },
      { step: "paid", orderId: "o1", email: "ada@example.com" },
      { step: "shipped", orderId: "o1", email: "ada@example.com" },
    ]);
  });

  it("does not notify for steps that were never emitted", () => {
    const pipeline = new OrderPipeline();
    pipeline.advance({ id: "o2", email: "b@example.com" }, "created");
    assert.equal(getSentNotifications().length, 1);
  });
});
