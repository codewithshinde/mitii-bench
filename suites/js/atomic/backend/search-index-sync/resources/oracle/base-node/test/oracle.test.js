import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hookDbMutation, index } from "../src/index.js";

describe("search-index-sync", () => {
  it("syncs insert/update/delete to in-memory index", () => {
    hookDbMutation("insert", "1", { title: "Hello" });
    hookDbMutation("update", "1", { title: "Hello World" });
    assert.equal(index.search("world").length, 1);
    hookDbMutation("delete", "1");
    assert.equal(index.search("world").length, 0);
  });
});
