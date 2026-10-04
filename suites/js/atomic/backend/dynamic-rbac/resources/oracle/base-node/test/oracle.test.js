import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canUserExecute } from "../src/rbac.js";

describe("dynamic-rbac", () => {
  it("evaluates role permissions with user overrides", () => {
    assert.equal(canUserExecute("u1", "delete", "doc"), true);
    assert.equal(canUserExecute("u2", "read", "doc"), true);
    assert.equal(canUserExecute("u2", "write", "doc"), true);
    assert.equal(canUserExecute("u2", "delete", "doc"), false);
  });
});
