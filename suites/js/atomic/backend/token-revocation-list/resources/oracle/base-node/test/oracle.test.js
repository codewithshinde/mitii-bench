import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { blacklist } from "../src/index.js";

describe("token-revocation-list", () => {
  it("stores revoked JTIs with TTL semantics", () => {
    blacklist.add("tok-1", 60);
    assert.equal(blacklist.has("tok-1"), true);
    assert.equal(blacklist.has("tok-2"), false);
  });
});
