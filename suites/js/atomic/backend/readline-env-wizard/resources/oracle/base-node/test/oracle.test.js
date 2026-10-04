import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Writable } from "node:stream";
import { writeEnvFile, runInteractiveEnvWizard } from "../src/envWizard.js";

function mockCreateInterface(answers) {
  return () => ({
    question: async (prompt) => answers[prompt] ?? "",
    close() {},
  });
}

describe("env wizard", () => {
  /** @type {string} */
  let dir;

  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "env-wizard-"));
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("writes parsed answers to .env", async () => {
    const path = join(dir, ".env");
    const body = await writeEnvFile({ host: "db.local", port: "5432", user: "app" }, path);
    assert.match(body, /DATABASE_HOST=db.local/);
    assert.equal(await readFile(path, "utf8"), body);
  });

  it("skips writing when user declines confirmation", async () => {
    const path = join(dir, "skip.env");
    const answers = {
      "Database Host: ": "db.local",
      "Database Port: ": "5432",
      "Database User: ": "app",
      "Write .env? (y/N): ": "n",
    };
    const output = new Writable({ write(_chunk, _enc, cb) { cb(); } });
    const result = await runInteractiveEnvWizard(
      null,
      output,
      path,
      mockCreateInterface(answers),
    );
    assert.equal(result, null);
    await assert.rejects(() => readFile(path, "utf8"));
  });
});
