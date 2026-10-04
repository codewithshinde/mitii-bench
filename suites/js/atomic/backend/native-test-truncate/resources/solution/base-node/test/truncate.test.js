import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { truncate } from "../src/truncate.js";

describe("truncate", () => {
  it("handles empty and null", () => {
    assert.equal(truncate("", 5), "");
    assert.equal(truncate(null, 5), "");
  });
  it("respects bounds", () => {
    assert.equal(truncate("abcdef", 3), "abc");
    assert.equal(truncate("hi", 10), "hi");
  });
});
