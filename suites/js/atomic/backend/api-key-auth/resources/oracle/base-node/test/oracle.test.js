import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createApiKey, apiKeyMiddleware } from "../src/index.js";

describe("api-key-auth", () => {
  it("validates X-API-Key and increments usage", () => {
    const key = createApiKey("test");
    let status;
    const req = { header: (h) => (h === "X-API-Key" ? key : undefined) };
    const res = { status: (c) => ({ json: () => { status = c; } }) };
    apiKeyMiddleware(req, res, () => { status = 200; });
    assert.equal(status, 200);
    assert.ok(req.apiKey);
  });
});
