import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { truncate } from "../src/truncate.js";

describe("truncate oracle", () => {
  it("handles null and empty strings", () => {
    assert.equal(truncate(null, 5), "");
    assert.equal(truncate("", 3), "");
  });

  it("truncates to max length and rejects invalid bounds", () => {
    assert.equal(truncate("abcdef", 3), "abc");
    assert.equal(truncate("hi", 10), "hi");
    assert.equal(truncate("abc", 0), "");
    assert.equal(truncate("abc", -1), "");
  });
});
