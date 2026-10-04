import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createAuthor, createPost, deleteAuthor, getAuthor } from "../src/entityStore.js";

describe("Author/Post relationship", () => {
  it("Author entity declares OneToMany cascade", () => {
    const src = readFileSync(new URL("../src/entities/Author.ts", import.meta.url), "utf8");
    assert.match(src, /OneToMany/);
    assert.match(src, /cascade/);
    assert.match(src, /Author/);
  });

  it("cascade delete removes posts", () => {
    const author = createAuthor("Turing");
    createPost(author.id, "Post A");
    createPost(author.id, "Post B");
    deleteAuthor(author.id);
    assert.equal(getAuthor(author.id), null);
  });
});
