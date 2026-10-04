import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";
import { repoRoot, suitesDir } from "./paths.js";

/**
 * Import solid-benchmark JSONL cases into task.yaml folders (category-by-category).
 * Usage: node cli.js import:solid --from ../Mitii/tests/benchmark --suite frontend --limit 5
 */
export function importSolidBenchmark({
  from,
  suite,
  limit = Infinity,
  dryRun = false,
  root = repoRoot(),
} = {}) {
  if (!from) {
    throw new Error("--from path required (solid-benchmark root)");
  }
  const fromAbs = isAbsolute(from) ? from : resolve(root, from);
  if (!existsSync(fromAbs)) {
    throw new Error(`--from path not found: ${fromAbs}`);
  }
  const suitesPath = join(fromAbs, "suites");
  if (!existsSync(suitesPath)) {
    throw new Error(`No suites/ under ${fromAbs}`);
  }

  const suiteDirs = suite
    ? [join(suitesPath, suite)]
    : readdirSync(suitesPath)
        .map((n) => join(suitesPath, n))
        .filter((p) => statSync(p).isDirectory());

  const imported = [];
  let remaining = limit;

  for (const suiteDir of suiteDirs) {
    if (!existsSync(suiteDir) || remaining <= 0) continue;
    const suiteName = basename(suiteDir);
    const casesDir = join(suiteDir, "cases");
    if (!existsSync(casesDir)) continue;

    for (const file of readdirSync(casesDir).filter((f) => f.endsWith(".jsonl"))) {
      if (remaining <= 0) break;
      const category = basename(file, ".jsonl");
      const lines = readFileSync(join(casesDir, file), "utf8")
        .split(/\r?\n/)
        .filter((l) => l.trim());

      for (const line of lines) {
        if (remaining <= 0) break;
        let raw;
        try {
          raw = JSON.parse(line);
        } catch {
          continue;
        }
        const slug = String(raw.id || "case")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const outDir = join(suitesDir(root), "js", "atomic", "imported", suiteName, category, slug);
        const task = solidToTaskYaml(raw, suiteName, category);
        imported.push({ id: task.id, outDir, suite: suiteName, category });
        if (!dryRun) {
          mkdirSync(join(outDir, "resources"), { recursive: true });
          writeFileSync(join(outDir, "task.yaml"), task.yaml);
          writeFileSync(join(outDir, "spec.md"), `${String(raw.prompt ?? "")}\n`);
          writeFileSync(
            join(outDir, "README.md"),
            `# ${raw.id}\n\nImported from solid-benchmark \`${suiteName}/${category}\`.\n\nReview grades and add \`resources/solution/<base>/\` before dry-run.\n`,
          );
        }
        remaining -= 1;
      }
    }
  }

  return { count: imported.length, imported, dryRun };
}

function solidToTaskYaml(raw, suiteName, category) {
  const id = raw.id ?? `${suiteName}-${category}-imported`;
  const gradeLines = [];
  for (const check of raw.checks ?? []) {
    const line = checkToGrade(check);
    if (line) gradeLines.push(line);
  }
  if (gradeLines.length === 0) {
    gradeLines.push("  - build: true");
  }

  const base = mapSolidFixture(raw.fixture);
  const yaml = `id: ${id}
title: ${JSON.stringify(raw.rationale || raw.id || id)}
ecosystem: js
bases:
  - ${base}
family: ${suiteName === "frontend" ? "frontend" : suiteName === "backend" || suiteName === "api-build" ? "api" : "frontend"}
difficulty: ${raw.difficulty ?? "medium"}
category: ${category}
language: javascript
tags: [${[suiteName, category, raw.capability].filter(Boolean).map((t) => JSON.stringify(t)).join(", ")}]
timeoutSec: 300
promptFile: spec.md
readmeFile: README.md
# Imported from solid-benchmark; review grades before dry-run.
grade:
${gradeLines.join("\n")}
`;

  return { id, yaml };
}

function checkToGrade(check) {
  switch (check.type) {
    case "file_contains":
      return `  - contains:\n      file: ${check.path}\n      text: ${JSON.stringify(check.value)}`;
    case "file_not_contains":
      return `  - notContains:\n      file: ${check.path}\n      text: ${JSON.stringify(check.value)}`;
    case "file_exists":
      return `  - exists:\n      file: ${check.path}`;
    case "command": {
      if (check.command === "npm run build" || /^npm run build\b/.test(check.command)) {
        return `  - build: true`;
      }
      if (check.command === "npm test" || /^npm test\b/.test(check.command)) {
        return `  - test: true`;
      }
      return `  - command:\n      run: ${JSON.stringify(check.command)}\n      timeoutMs: ${check.timeoutMs ?? 120000}`;
    }
    case "http":
      return `  - http: ${JSON.stringify(check).replace(/"type":"http",?/, "")}`;
    case "sqlite_query":
      return `  - sqlite_query:\n      dbPath: ${JSON.stringify(check.dbPath)}\n      sql: ${JSON.stringify(check.sql)}\n      column: ${JSON.stringify(check.column ?? "n")}\n      equals: ${JSON.stringify(check.equals)}`;
    case "workspace_changed":
      return `  - workspace_changed: true`;
    case "workspace_unchanged":
      return `  - workspace_unchanged: true`;
    case "agent_exit":
    case "output_not_empty":
    case "jsonl_event":
      return null;
    default:
      return null;
  }
}

function mapSolidFixture(name) {
  const map = {
    "react-vite": "base-react-js",
    "frontend-app": "base-react-js",
    "next-app": "base-next-js",
    "node-express": "base-node",
    "sqlite-crud-api": "base-node",
    "nest-api": "base-nest-js",
    "saas-api": "base-nest-js",
  };
  return map[name] ?? "base-node";
}
