import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("config-hot-reload", () => {
  it("loads config.json into memory", async () => {
    const { config } = await import("../src/index.js");
    assert.equal(typeof config, "object");
    assert.ok("maxUsers" in config || "featureX" in config);
  });
});
