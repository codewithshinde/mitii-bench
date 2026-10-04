import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getSystemStats } from "../src/systemStats.js";

describe("getSystemStats", () => {
  it("returns memory, load, and uptime", () => {
    const stats = getSystemStats();
    assert.equal(typeof stats.memoryUsagePercent, "number");
    assert.ok(Array.isArray(stats.loadAverage));
    assert.equal(stats.loadAverage.length, 3);
    assert.equal(typeof stats.uptime, "number");
  });

  it("keeps memory usage within valid percentage bounds", () => {
    const stats = getSystemStats();
    assert.ok(stats.memoryUsagePercent >= 0);
    assert.ok(stats.memoryUsagePercent <= 100);
    assert.ok(stats.uptime >= 0);
  });
});
