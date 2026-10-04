import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shadowMiddleware, shadowLog } from "../src/index.js";

describe("traffic-shadowing", () => {
  it("mirrors requests asynchronously", async () => {
    shadowLog.length = 0;
    const mw = shadowMiddleware("http://staging");
    await new Promise((resolve) => {
      mw({ method: "GET", originalUrl: "/api/data" }, {}, () => resolve());
    });
    await new Promise((r) => setImmediate(r));
    assert.equal(shadowLog.length, 1);
    assert.equal(shadowLog[0].stagingUrl, "http://staging");
  });
});
