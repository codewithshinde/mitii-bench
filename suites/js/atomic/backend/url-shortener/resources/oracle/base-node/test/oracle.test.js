import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("url-shortener", () => {
  it("stores links in sqlite", async () => {
    const { db } = await import("../src/index.js");
    db.prepare("INSERT INTO links(code,url) VALUES(?,?)").run("abc", "https://example.com");
    const row = db.prepare("SELECT url FROM links WHERE code=?").get("abc");
    assert.equal(row.url, "https://example.com");
  });
});
