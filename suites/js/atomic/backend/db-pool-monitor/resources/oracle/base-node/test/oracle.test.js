import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { monitorPool, setPoolState, alerts } from "../src/index.js";

describe("db-pool-monitor", () => {
  it("emits alert on queued request starvation", () => {
    alerts.length = 0;
    setPoolState({ queuedRequests: 6 });
    const snap = monitorPool();
    assert.equal(snap.queuedRequests, 6);
    assert.equal(alerts.length, 1);
  });
});
