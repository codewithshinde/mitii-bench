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

test("compiles package_deps and api_oracle", () => {
  const checks = compileGrade([
    { package_deps: { packages: ["zod", "multer"] } },
    { api_oracle: true },
    { build: true },
  ]);
  const pkg = checks.find((c) => c.type === "package_deps");
  assert.ok(pkg);
  assert.deepEqual(pkg.packages, ["zod", "multer"]);
  assert.ok(
    checks.some(
      (c) =>
        c.type === "command" &&
        c.command === "MITII_NO_LISTEN=1 node --test test/oracle.test.js",
    ),
  );
});
