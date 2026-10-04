#!/usr/bin/env node
/**
 * Materialize references/node-tasks.md into suites/js/atomic/backend/* cases
 * with solutions, api_oracle tests, HTTP payload grades, and package_deps.
 */
import { mkdirSync, writeFileSync, existsSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { nodeCoreCases } from "./data/node-core-cases.mjs";
import { nodeEcosystemCases } from "./data/node-ecosystem-cases.mjs";
import { nodeRealworldCases } from "./data/node-realworld-cases.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const backendRoot = join(root, "suites", "js", "atomic", "backend");
const REF = join(root, "references", "node-tasks.md");

const FORCE = process.argv.includes("--force");
const CORE_ONLY = process.argv.includes("--core-only");
const ECO_ONLY = process.argv.includes("--eco-only");
const REAL_ONLY = process.argv.includes("--realworld-only");

function yamlQuote(s) {
  return JSON.stringify(s);
}

function parsePrompts(md) {
  const re = /^#{3,4}\s+(\d+)\.\s+(.+?)\s*$/gm;
  const matches = [...md.matchAll(re)];
  const map = new Map();
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const n = Number(m[1]);
    const start = m.index + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : md.length;
    let body = md.slice(start, end).trim();
    body = body.split(/\n---\n/)[0].trim();
    body = body.replace(/\n## .*$/s, "").trim();
    map.set(n, body);
  }
  return map;
}

function gradeYaml(file, markers) {
  const lines = [];
  const seen = new Set();
  for (const m of markers ?? []) {
    if (seen.has(m)) continue;
    seen.add(m);
    lines.push("- contains:");
    lines.push(`    file: ${file}`);
    lines.push(`    text: ${yamlQuote(m)}`);
  }
  return lines.length ? `${lines.join("\n")}\n` : "";
}

function httpGradeYaml(httpGrade) {
  return `- http: ${JSON.stringify(httpGrade)}\n`;
}

function writeCaseDir(caseDir, files) {
  if (existsSync(caseDir)) {
    if (!FORCE) {
      console.log(`skip (exists): ${caseDir}`);
      return false;
    }
    rmSync(caseDir, { recursive: true, force: true });
  }
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(caseDir, rel);
    mkdirSync(dirname(abs), { recursive: true });
    const text = typeof content === "string" ? content : String(content);
    writeFileSync(abs, text.endsWith("\n") ? text : `${text}\n`);
  }
  return true;
}

function materialize(c, promptFromRef) {
  const id = `backend-${c.slug}`;
  const caseDir = join(backendRoot, c.slug);
  const bases = c.bases?.length ? c.bases : ["base-node"];
  const packages = c.packages ?? [];
  const primaryBase = bases[0];
  const prompt = (promptFromRef || c.prompt || "").trim();
  const hasOracle = Boolean(c.oracle);
  const hasHttp = Boolean(c.http);
  const solutionFiles = c.files ?? {};

  if (Object.keys(solutionFiles).length === 0) {
    throw new Error(`Case ${c.slug} has empty solution files`);
  }
  if (!hasOracle && !hasHttp) {
    throw new Error(`Case ${c.slug} needs api_oracle and/or http grades`);
  }

  const tags = [
    ...new Set([
      ...(c.tags ?? []),
      "node-tasks",
      ...(c.smoke ? ["smoke"] : []),
      ...(packages.length ? ["ecosystem-lib"] : ["vanilla"]),
    ]),
  ];

  const gradeLines = ["  - build: true"];
  if (packages.length) {
    gradeLines.push(
      `  - package_deps:\n      packages: [${packages.map((p) => yamlQuote(p)).join(", ")}]`,
    );
  }
  if (hasOracle) {
    gradeLines.push(`  - api_oracle:
      command: "npm test -- test/oracle.test.js"
      timeoutMs: 120000`);
  }

  const taskYaml = `id: ${id}
title: ${yamlQuote(c.title)}
ecosystem: js
bases:
${bases.map((b) => `  - ${b}`).join("\n")}
family: api
packages: [${packages.map((p) => yamlQuote(p)).join(", ")}]
difficulty: ${c.difficulty}
category: backend
language: javascript
tags: [${tags.map((t) => yamlQuote(t)).join(", ")}]
timeoutSec: 300
promptFile: spec.md
readmeFile: README.md
grade:
${gradeLines.join("\n")}
`;

  const implHint =
    primaryBase === "base-nest-js"
      ? `Implement under the NestJS fixture (\`${c.gradeFile}\` and related modules). Keep the app buildable with \`npm run build\`.`
      : `Implement primarily in \`${c.gradeFile}\` (add helper modules under \`src/\` as needed). Keep \`npm run build\` succeeding.${
          packages.length
            ? ` Install required packages: ${packages.map((p) => `\`${p}\``).join(", ")}.`
            : ""
        }`;

  const spec = `${prompt}

${implHint}
`;

  const kind =
    c.n <= 25 ? "Node.js core / async" : c.n <= 55 ? "frameworks & ecosystem" : "real-world backend";

  const readme = `# ${c.title}

## Goal

${prompt.split("\n")[0]}

## Ecosystem

\`js\` — ${kind} (prompt #${c.n} from \`references/node-tasks.md\`).

## Bases

${bases.map((b) => `- \`${b}\``).join("\n")}

## Packages

${packages.length ? packages.map((p) => `- \`${p}\``).join("\n") : "_None beyond the base fixture._"}

\`\`\`bash
pnpm case:dry-run ${id}
pnpm case:dry-run ${id}@${primaryBase}
\`\`\`

## How we grade

- Shared: \`npm run build\`
${packages.length ? "- Shared: \`package_deps\` — required packages listed in \`package.json\`\n" : ""}${hasOracle ? "- Shared: \`api_oracle\` — agent-hidden \`node:test\` behavioral suite\n" : ""}${hasHttp ? "- Per-base: HTTP multi-step status / payload / header checks\n" : ""}- Per-base: structural \`contains\` markers
- \`resources/solution/\` is dry-run only (never shown to the agent)

Source: \`references/node-tasks.md\`.
`;

  let perBaseGrade = gradeYaml(c.gradeFile, c.markers);
  if (hasHttp) perBaseGrade += httpGradeYaml(c.http);

  const outFiles = {
    "task.yaml": taskYaml,
    "spec.md": spec,
    "README.md": readme,
    [`grade/${primaryBase}.yaml`]: perBaseGrade || "- exists:\n    file: package.json\n",
  };

  for (const [rel, content] of Object.entries(solutionFiles)) {
    outFiles[`resources/solution/${primaryBase}/${rel}`] = content;
  }
  if (hasOracle) {
    const oracle = c.oracle.endsWith("\n") ? c.oracle : `${c.oracle}\n`;
    outFiles[`resources/oracle/${primaryBase}/test/oracle.test.js`] = oracle;
  }

  const wrote = writeCaseDir(caseDir, outFiles);
  return {
    id,
    wrote,
    smoke: Boolean(c.smoke),
    hasHttp,
    packages: packages.length,
  };
}

function main() {
  if (!existsSync(REF)) {
    console.error(`Missing ${REF}`);
    process.exit(1);
  }
  const prompts = parsePrompts(readFileSync(REF, "utf8"));
  let cases = [...nodeCoreCases, ...nodeEcosystemCases, ...nodeRealworldCases];
  if (CORE_ONLY) cases = cases.filter((c) => c.n <= 25);
  if (ECO_ONLY) cases = cases.filter((c) => c.n >= 26 && c.n <= 55);
  if (REAL_ONLY) cases = cases.filter((c) => c.n >= 56);

  const results = [];
  for (const c of cases) {
    results.push(materialize(c, prompts.get(c.n)));
  }

  const wrote = results.filter((r) => r.wrote).length;
  console.log(
    `Materialized ${wrote}/${results.length} backend cases (http=${results.filter((r) => r.hasHttp).length}, smoke=${results.filter((r) => r.smoke).length}, withPackages=${results.filter((r) => r.packages).length})`,
  );
}

main();
