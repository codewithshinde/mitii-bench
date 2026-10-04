import test from "node:test";
import assert from "node:assert/strict";
import { compileGrade } from "../src/grade-compiler.js";

test("compiles contains + build and injects defaults", () => {
  const checks = compileGrade([
    { contains: { file: "src/App.jsx", text: "Docs" } },
    { build: true },
  ]);
  assert.equal(checks[0].type, "agent_exit");
  assert.ok(checks.some((c) => c.type === "workspace_changed"));
  assert.ok(checks.some((c) => c.type === "file_contains" && c.value === "Docs"));
  assert.ok(checks.some((c) => c.type === "command" && c.command === "npm run build"));
});

test("honors workspace_changed: false", () => {
  const checks = compileGrade([{ workspace_changed: false }, { build: true }]);
  assert.ok(checks.some((c) => c.type === "workspace_unchanged"));
  assert.ok(!checks.some((c) => c.type === "workspace_changed"));
});
