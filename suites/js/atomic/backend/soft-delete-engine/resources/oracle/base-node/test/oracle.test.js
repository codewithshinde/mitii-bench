import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { softDb } from "../src/softDelete.js";

describe("soft-delete-engine", () => {
  it("filters deleted_at rows from find", () => {
    softDb.insert("users", { id: 1, name: "Ada" });
    softDb.softDelete("users", 1);
    assert.equal(softDb.find("users").length, 0);
    assert.equal(softDb.hardCount("users"), 1);
  });
});
