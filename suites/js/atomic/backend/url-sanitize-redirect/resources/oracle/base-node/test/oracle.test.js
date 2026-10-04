import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sanitizeRedirectUrl } from "../src/sanitizeRedirectUrl.js";

describe("sanitizeRedirectUrl", () => {
  it("keeps whitelisted hosts and strips tracking params", () => {
    const out = sanitizeRedirectUrl("https://example.com/path?utm_source=x&ok=1&fbclid=y");
    assert.equal(out, "https://example.com/path?ok=1");
  });
  it("rejects unknown hosts", () => {
    assert.throws(() => sanitizeRedirectUrl("https://evil.com/"), /Host not allowed/);
  });
});
