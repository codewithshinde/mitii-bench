import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { analyzeQuery } from "../src/index.js";

describe("graphql-complexity-limit", () => {
  it("rejects deep/complex queries", () => {
    const shallow = analyzeQuery("{ user { id } }");
    assert.equal(shallow.allowed, true);
    const deep = analyzeQuery("{ a { b { c { d { e { f { g } } } } } } }");
    assert.equal(deep.allowed, false);
  });
});
