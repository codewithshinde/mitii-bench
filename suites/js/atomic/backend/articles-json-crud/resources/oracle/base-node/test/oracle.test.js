import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("articles-json-crud", () => {
  let dir;
  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "articles-"));
    process.chdir(dir);
  });
  after(async () => {
    process.chdir(tmpdir());
    await rm(dir, { recursive: true, force: true });
  });

  it("writes atomically via tmp rename", async () => {
    const { saveArticles, loadArticles } = await import("../src/index.js");
    await saveArticles([{ id: 1, title: "First", body: "text" }]);
    const rows = await loadArticles();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].title, "First");
  });
});
