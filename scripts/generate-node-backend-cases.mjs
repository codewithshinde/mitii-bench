#!/usr/bin/env node
/**
 * Materialize references/node-tasks.md into suites/js/atomic/backend/* cases.
 *
 * Core (1–25): base-node, vanilla; smoke subset ships solutions + oracles.
 * Ecosystem (26–55): package-tagged scaffolds; NestJS on base-nest-js.
 * Real-world (56–100): base-node scaffolds (vanilla or ecosystem-lib).
 */
import { mkdirSync, writeFileSync, existsSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { nodeBackendMeta } from "./data/node-backend-meta.mjs";
import { nodeCoreSolutions } from "./data/node-core-solutions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const backendRoot = join(root, "suites", "js", "atomic", "backend");
const REF = join(root, "references", "node-tasks.md");

const FORCE = process.argv.includes("--force");
const CORE_ONLY = process.argv.includes("--core-only");
const ECO_ONLY = process.argv.includes("--eco-only");
const REAL_ONLY = process.argv.includes("--realworld-only");

const SMOKE = new Set([
  "http-native-server",
  "buffer-file-type",
  "crypto-scrypt-password",
  "path-traversal-defense",
  "url-sanitize-redirect",
  "os-system-stats",
  "native-test-truncate",
  "data-masking",
]);

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
  return `${lines.join("\n")}\n`;
}

function gradeFromAsserts(asserts) {
  const lines = [];
  for (const item of asserts) {
    if (item.contains) {
      lines.push("- contains:");
      lines.push(`    file: ${item.contains.file}`);
      lines.push(`    text: ${yamlQuote(item.contains.text)}`);
    } else if (item.exists) {
      lines.push("- exists:");
      lines.push(`    file: ${item.exists.file}`);
    }
  }
  return `${lines.join("\n")}\n`;
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

function httpGradeYaml(httpGrade) {
  // Use JSON flow so nested request steps stay unambiguous for the YAML parser.
  return `- http: ${JSON.stringify(httpGrade)}\n`;
}

function materialize(meta, prompt) {
  const id = `backend-${meta.slug}`;
  const caseDir = join(backendRoot, meta.slug);
  const bases = meta.bases ?? ["base-node"];
  const packages = meta.packages ?? [];
  const solution = nodeCoreSolutions[meta.slug];
  const hasOracle = Boolean(solution?.oracle);
  const hasHttp = Boolean(solution?.httpGrade);
  const hasSolutionFiles = Boolean(solution?.files && Object.keys(solution.files).length);
  const isSmoke = SMOKE.has(meta.slug);

  const tags = [
    ...new Set([
      ...(meta.tags ?? []),
      "node-tasks",
      ...(isSmoke ? ["smoke"] : []),
      ...(packages.length ? ["ecosystem-lib"] : []),
    ]),
  ];

  const gradeLines = ["  - build: true"];
  if (hasOracle || (meta.slug === "native-test-truncate" && hasSolutionFiles)) {
    gradeLines.push("  - test: true");
  }
  if (hasHttp) {
    // http recipe lives in per-base grade file alongside contains
  }

  const taskYaml = `id: ${id}
title: ${yamlQuote(meta.title)}
ecosystem: js
bases:
${bases.map((b) => `  - ${b}`).join("\n")}
family: api
packages: [${packages.map((p) => yamlQuote(p)).join(", ")}]
difficulty: ${meta.difficulty}
category: backend
language: javascript
tags: [${tags.map((t) => yamlQuote(t)).join(", ")}]
timeoutSec: 300
promptFile: spec.md
readmeFile: README.md
grade:
${gradeLines.join("\n")}
`;

  const primaryBase = bases[0];
  const implHint =
    primaryBase === "base-nest-js"
      ? `Implement under the NestJS fixture (\`${meta.gradeFile}\` and related modules). Keep the app buildable with \`npm run build\`.`
      : `Implement primarily in \`${meta.gradeFile}\` (add helper modules under \`src/\` as needed). Keep \`npm run build\` succeeding.`;

  const spec = `${prompt.trim()}

${implHint}
`;

  const kindLabel =
    meta.kind === "core"
      ? "Node.js core / async"
      : meta.kind === "ecosystem"
        ? "frameworks & ecosystem packages"
        : "real-world backend";

  const readme = `# ${meta.title}

## Goal

${prompt.split("\n")[0]}

## Ecosystem

\`js\` — ${kindLabel} (prompt #${meta.n} from \`references/node-tasks.md\`).

## Bases

${bases.map((b) => `- \`${b}\``).join("\n")}

## Packages

${packages.length ? packages.map((p) => `- \`${p}\``).join("\n") : "_None beyond the base fixture (vanilla / core APIs)._"}

\`\`\`bash
pnpm case:dry-run ${id}
pnpm case:dry-run ${id}@${primaryBase}
\`\`\`

## How we grade

- Shared: \`npm run build\`
${hasOracle || meta.slug === "native-test-truncate" ? "- Shared: \`npm test\` (agent-hidden oracle and/or case tests)\n" : ""}${hasHttp ? "- Shared: HTTP behavioral checks against a started server\n" : ""}- Per-base: source marker asserts in \`grade/${primaryBase}.yaml\`
- \`resources/solution/\` is dry-run only

${!hasSolutionFiles ? "Dry-run solution not shipped yet — use agent evals for this case.\n" : ""}Source: \`references/node-tasks.md\`.
`;

  let perBaseGrade = meta.gradeAsserts?.length
    ? gradeFromAsserts(meta.gradeAsserts)
    : gradeYaml(meta.gradeFile, meta.markers);
  if (hasHttp) {
    perBaseGrade += httpGradeYaml(solution.httpGrade);
  }

  const files = {
    "task.yaml": taskYaml,
    "spec.md": spec,
    "README.md": readme,
    [`grade/${primaryBase}.yaml`]: perBaseGrade,
  };

  if (hasSolutionFiles) {
    for (const [rel, content] of Object.entries(solution.files)) {
      files[`resources/solution/${primaryBase}/${rel}`] = content;
    }
  } else {
    files[`resources/solution/${primaryBase}/.gitkeep`] = "";
  }

  if (solution?.oracle) {
    files[`resources/oracle/${primaryBase}/test/oracle.test.js`] = solution.oracle;
  }

  const wrote = writeCaseDir(caseDir, files);
  return { id, wrote, kind: meta.kind, smoke: isSmoke };
}

function main() {
  if (!existsSync(REF)) {
    console.error(`Missing ${REF}`);
    process.exit(1);
  }
  const prompts = parsePrompts(readFileSync(REF, "utf8"));
  if (prompts.size !== 100) {
    console.warn(`Expected 100 prompts, parsed ${prompts.size}`);
  }

  const results = [];
  for (const meta of nodeBackendMeta) {
    if (CORE_ONLY && meta.kind !== "core") continue;
    if (ECO_ONLY && meta.kind !== "ecosystem") continue;
    if (REAL_ONLY && meta.kind !== "realworld") continue;
    const prompt = prompts.get(meta.n);
    if (!prompt) {
      console.warn(`No prompt body for #${meta.n} ${meta.slug}`);
      continue;
    }
    results.push(materialize(meta, prompt));
  }

  const wrote = results.filter((r) => r.wrote).length;
  console.log(
    `Materialized ${wrote} backend cases (${results.length - wrote} skipped). defs=${results.length}`,
  );
  console.log(`Smoke with solutions: ${results.filter((r) => r.smoke && r.wrote).length}`);
}

main();
