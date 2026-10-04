import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("api-gateway-proxy", () => {
  it("loads proxy gateway module", async () => {
    const mod = await import("../src/index.js");
    assert.ok(mod.app);
    // Drain any listen handle if the implementation ignored MITII_NO_LISTEN.
    if (mod.server && typeof mod.server.close === "function") {
      await new Promise((resolve) => mod.server.close(() => resolve()));
    }
  });
});
