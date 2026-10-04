import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { maskSensitive } from "../src/maskSensitive.js";

describe("maskSensitive", () => {
  it("redacts nested sensitive keys", () => {
    const out = maskSensitive({
      name: "Ada",
      password: "secret",
      nested: { ssn: "111-22-3333", creditCard: "4111" },
    });
    assert.equal(out.name, "Ada");
    assert.equal(out.password, "***REDACTED***");
    assert.equal(out.nested.ssn, "***REDACTED***");
    assert.equal(out.nested.creditCard, "***REDACTED***");
  });
});
