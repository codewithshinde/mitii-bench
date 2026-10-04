import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("api-gateway-proxy", () => {
  it("loads proxy gateway module", async () => {
    const mod = await import("../src/index.js");
    assert.ok(mod.app);
  });
});
