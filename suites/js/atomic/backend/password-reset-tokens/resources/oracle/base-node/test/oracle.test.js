import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { requestReset, resetPassword } from "../src/passwordReset.js";

describe("password-reset-tokens", () => {
  it("issues token then validates once", () => {
    const { token } = requestReset("u@example.com");
    const ok = resetPassword("u@example.com", token, "newpass");
    assert.equal(ok.ok, true);
    const again = resetPassword("u@example.com", token, "x");
    assert.equal(again.ok, false);
  });
});
