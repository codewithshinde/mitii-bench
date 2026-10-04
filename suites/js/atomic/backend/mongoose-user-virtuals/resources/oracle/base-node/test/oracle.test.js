import { describe, it } from "node:test";
import assert from "node:assert/strict";
import User from "../src/models/User.js";

describe("User virtual fullName", () => {
  it("concatenates names and serializes virtuals", () => {
    const u = new User({ firstName: "Ada", lastName: "Lovelace" });
    assert.equal(u.fullName, "Ada Lovelace");
    const json = u.toJSON();
    assert.equal(json.fullName, "Ada Lovelace");
    assert.equal(json.firstName, "Ada");
  });
});
