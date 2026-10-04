import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/passwordHash.js";

describe("hashPassword", () => {
  it("returns salt:derivedKey hex", async () => {
    const hashed = await hashPassword("secret");
    assert.match(hashed, /^[0-9a-f]+:[0-9a-f]+$/);
  });
  it("verifies same password and rejects wrong", async () => {
    const hashed = await hashPassword("secret");
    assert.equal(await verifyPassword("secret", hashed), true);
    assert.equal(await verifyPassword("nope", hashed), false);
  });
  it("uses different salts", async () => {
    const a = await hashPassword("secret");
    const b = await hashPassword("secret");
    assert.notEqual(a, b);
  });
});
