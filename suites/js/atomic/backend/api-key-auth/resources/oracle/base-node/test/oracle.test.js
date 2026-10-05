import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createApiKey, apiKeyMiddleware } from "../src/index.js";

/** Minimal Express-like request: supports both `req.header(name)` and `req.headers[name]`. */
function makeReq(headers) {
  const normalized = Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [String(k).toLowerCase(), v]),
  );
  return {
    headers: normalized,
    header(name) {
      return normalized[String(name).toLowerCase()];
    },
  };
}

describe("api-key-auth", () => {
  it("validates X-API-Key and increments usage", () => {
    const key = createApiKey("test");
    assert.equal(typeof key, "string");
    assert.ok(key.length > 0);

    let status;
    const req = makeReq({ "X-API-Key": key });
    const res = { status: (c) => ({ json: () => { status = c; } }) };

    apiKeyMiddleware(req, res, () => {
      status = 200;
    });
    assert.equal(status, 200);
    assert.ok(req.apiKey);
    assert.equal(typeof req.apiKey.usage, "number");
    const first = req.apiKey.usage;

    apiKeyMiddleware(req, res, () => {
      status = 200;
    });
    assert.equal(status, 200);
    assert.equal(req.apiKey.usage, first + 1);
  });
});
