import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { setFeatureRollout, isFeatureEnabled } from "../src/featureFlags.js";

describe("feature-flag-manager", () => {
  it("is deterministic per userId+key rollout", () => {
    setFeatureRollout("new-ui", 50);
    const a1 = isFeatureEnabled("new-ui", { userId: "user-42" });
    const a2 = isFeatureEnabled("new-ui", { userId: "user-42" });
    assert.equal(a1, a2);
  });
});
