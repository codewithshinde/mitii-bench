import { describe, it, after } from "node:test";
import assert from "node:assert/strict";

describe("redis-pubsub-notifications", () => {
  after(async () => {
    const { httpServer, io } = await import("../src/index.js");
    io.close();
    await new Promise((resolve) => httpServer.close(resolve));
  });

  it("delivers pub/sub messages in-process", async () => {
    const { bus } = await import("../src/index.js");
    const seen = [];
    bus.subscribe("alerts", (m) => seen.push(m));
    bus.publish("alerts", "hello");
    assert.deepEqual(seen, ["hello"]);
  });
});
