import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { appendEvent, getStream, replay } from "../src/eventStore.js";

describe("event-sourcing-store", () => {
  it("appendEvent/getStream replay rebuilds state", () => {
    appendEvent("order-1", "Created", { total: 0 });
    appendEvent("order-1", "ItemAdded", { amount: 10 });
    const events = getStream("order-1");
    assert.equal(events.length, 2);
    const total = replay("order-1", (s, ev) => {
      if (ev.type === "ItemAdded") return s + ev.data.amount;
      return s;
    }, 0);
    assert.equal(total, 10);
  });
});
