import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkHeapLimits } from "../src/heapLimits.js";

describe("checkHeapLimits", () => {
  it("returns heap statistics with ratio", () => {
    const stats = checkHeapLimits();
    assert.ok(stats.usedHeapSize > 0);
    assert.ok(stats.heapSizeLimit > 0);
    assert.ok(stats.usageRatio >= 0 && stats.usageRatio <= 1);
    assert.equal(typeof stats.exceeded, "boolean");
  });

  it("flags exceeded when threshold is forced low", () => {
    const stats = checkHeapLimits(0);
    assert.equal(stats.exceeded, true);
    assert.match(stats.warning ?? "", /exceeds/);
  });
});
