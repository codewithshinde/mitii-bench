import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { appendLog } from "../src/logRotator.js";

describe("appendLog", () => {
  /** @type {string} */
  let dir;

  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "log-rotator-"));
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("appends timestamped lines", async () => {
    const file = join(dir, "app.log");
    await appendLog(file, "hello");
    const text = await readFile(file, "utf8");
    assert.match(text, /^\d{4}-\d{2}-\d{2}T.* hello\n$/);
  });

  it("rotates to .old when file exceeds 1MB", async () => {
    const file = join(dir, "big.log");
    await writeFile(file, "x".repeat(1024 * 1024));
    await appendLog(file, "trigger");
    const old = await readFile(`${file}.old`, "utf8");
    const current = await readFile(file, "utf8");
    assert.equal(old.length, 1024 * 1024);
    assert.match(current, /trigger\n$/);
  });
});
