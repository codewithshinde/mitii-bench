import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { maskSensitive } from "../src/maskSensitive.js";

describe("data-masking", () => {
  it("recursively masks ssn/password/creditCard", () => {
    const out = maskSensitive({ name: "Ada", password: "x", nested: { ssn: "1", creditCard: "4111" } });
    assert.equal(out.password, "***REDACTED***");
    assert.equal(out.nested.ssn, "***REDACTED***");
    assert.equal(out.nested.creditCard, "***REDACTED***");
  });
});
