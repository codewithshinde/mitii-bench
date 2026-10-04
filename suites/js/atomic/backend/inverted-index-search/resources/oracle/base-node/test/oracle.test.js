import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { InvertedIndex } from "../src/searchIndex.js";

describe("inverted-index-search", () => {
  it("ranks TF-IDF matches", () => {
    const idx = new InvertedIndex();
    idx.add({ text: "node backend services" });
    idx.add({ text: "backend api design" });
    const hits = idx.search("backend");
    assert.ok(hits.length >= 1);
    assert.ok(hits[0].score > 0);
  });
});
