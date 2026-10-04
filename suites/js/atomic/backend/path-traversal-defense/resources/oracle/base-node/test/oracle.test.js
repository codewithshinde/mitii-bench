import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getPublicFile } from "../src/getPublicFile.js";

describe("getPublicFile", () => {
  before(async () => {
    await mkdir(join(process.cwd(), "src", "public"), { recursive: true });
    await writeFile(join(process.cwd(), "src", "public", "a.txt"), "hello");
  });

  it("reads files inside public", async () => {
    const buf = await getPublicFile("a.txt");
    assert.equal(buf.toString("utf8"), "hello");
  });

  it("rejects traversal", async () => {
    await assert.rejects(() => getPublicFile("../package.json"), (err) => err.code === "EACCES");
    await assert.rejects(() => getPublicFile("../../secret.txt"), (err) => err.code === "EACCES");
  });
});
