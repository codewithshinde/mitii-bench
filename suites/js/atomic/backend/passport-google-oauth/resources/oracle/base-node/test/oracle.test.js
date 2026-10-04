import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("Google OAuth routes", () => {
  it("registers /auth/google and callback with GoogleStrategy", () => {
    const auth = readFileSync("src/auth/google.js", "utf8");
    const idx = readFileSync("src/index.js", "utf8");
    assert.match(auth, /GoogleStrategy/);
    assert.match(idx, /\/auth\/google/);
    assert.match(idx, /\/auth\/google\/callback/);
  });
});
