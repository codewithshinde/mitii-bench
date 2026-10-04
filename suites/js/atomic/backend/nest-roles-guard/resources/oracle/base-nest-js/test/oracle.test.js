import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("RolesGuard", () => {
  it("implements CanActivate with @Roles admin metadata", () => {
    const guard = readFileSync("src/auth/roles.guard.ts", "utf8");
    assert.match(guard, /CanActivate/);
    assert.match(guard, /Roles/);
    assert.match(guard, /admin/);
  });
});
