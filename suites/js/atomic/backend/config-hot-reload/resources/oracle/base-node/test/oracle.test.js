import { describe, it, after } from "node:test";
import assert from "node:assert/strict";

describe("config-hot-reload", () => {
  after(async () => {
    const { configWatcher, server } = await import("../src/index.js");
    configWatcher?.close?.();
    await new Promise((resolve) => server.close?.(resolve));
  });

  it("loads config.json into memory", async () => {
    const { config } = await import("../src/index.js");
    assert.equal(typeof config, "object");
    assert.ok("maxUsers" in config || "featureX" in config);
  });
});
