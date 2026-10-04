import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { seedUsers } from "../src/index.js";

describe("db-seeder-script", () => {
  it("deterministic faker output with wired foreign keys", () => {
    const a = seedUsers(5, 99);
    const b = seedUsers(5, 99);
    assert.deepEqual(a, b);
    assert.equal(a[0].companyId, 1);
  });
});
