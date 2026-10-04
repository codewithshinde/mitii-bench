import { describe, it } from "node:test";
import assert from "node:assert/strict";
import speakeasy from "speakeasy";

describe("totp-2fa", () => {
  it("generates and verifies TOTP codes", () => {
    const secret = speakeasy.generateSecret().base32;
    const token = speakeasy.totp({ secret, encoding: "base32" });
    assert.equal(speakeasy.totp.verify({ secret, encoding: "base32", token }), true);
  });
});
