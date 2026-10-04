import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { searchProducts } from "../src/productSearch.js";

describe("searchProducts", () => {
  it("filters by category and search with pagination metadata", async () => {
    const out = await searchProducts({ page: 1, limit: 1, category: "electronics", search: "a" });
    assert.equal(out.items.length, 1);
    assert.ok(out.totalCount >= 1);
    assert.equal(out.currentPage, 1);
    assert.ok(out.totalPages >= 1);
  });
});
