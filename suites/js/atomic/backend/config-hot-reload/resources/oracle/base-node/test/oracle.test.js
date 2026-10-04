import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { config } from "../src/index.js";

describe("config-hot-reload", () => {
  it("loads config.json into memory", () => {
    assert.equal(typeof config, "object");
    assert.ok("maxUsers" in config || "featureX" in config);
  });
});
