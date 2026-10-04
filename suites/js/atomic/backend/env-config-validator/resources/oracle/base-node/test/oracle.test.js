import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("accepts valid DATABASE_URL and PORT", () => {
    const cfg = loadConfig({ DATABASE_URL: "https://db.example.com/main", PORT: "3000" });
    assert.equal(cfg.PORT, 3000);
  });

  it("throws descriptive error for missing vars", () => {
    assert.throws(() => loadConfig({}), /Invalid environment configuration/);
    assert.throws(
      () => loadConfig({ DATABASE_URL: "not-a-url", PORT: "0" }),
      /DATABASE_URL|PORT/,
    );
  });
});
