import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { seal, open } from "../src/index.js";

describe("secure-cookie-session", () => {
  it("round-trips AES-256-GCM session payload", () => {
    const token = seal({ userId: "u1" });
    assert.deepEqual(open(token), { userId: "u1" });
  });
});
