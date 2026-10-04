import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fetchPostsWithAuthors } from "../src/batchDemo.js";

describe("author DataLoader", () => {
  it("batches author loads for posts", async () => {
    const posts = [
      { id: 1, authorId: 1 },
      { id: 2, authorId: 2 },
      { id: 3, authorId: 1 },
    ];
    const out = await fetchPostsWithAuthors(posts);
    assert.equal(out[0].author.name, "Turing");
    assert.equal(out[2].author.name, "Turing");
    assert.equal(out[1].author.name, "Lovelace");
  });
});
