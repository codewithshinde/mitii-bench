import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { bus } from "../src/index.js";

describe("redis-pubsub-notifications", () => {
  it("delivers pub/sub messages in-process", () => {
    const seen = [];
    bus.subscribe("alerts", (m) => seen.push(m));
    bus.publish("alerts", "hello");
    assert.deepEqual(seen, ["hello"]);
  });
});
