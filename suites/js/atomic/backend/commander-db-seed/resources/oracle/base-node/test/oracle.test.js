import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("commander db:seed", () => {
  it("parses --count flag", () => {
    const r = spawnSync(process.execPath, [join(root, "src/cli.js"), "db:seed", "--count", "3"], {
      encoding: "utf8",
    });
    assert.equal(r.status, 0);
    const out = JSON.parse(r.stdout.trim());
    assert.equal(out.command, "db:seed");
    assert.equal(out.count, 3);
    assert.equal(out.seeded, 3);
  });
});
