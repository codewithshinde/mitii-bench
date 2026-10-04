import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { listFixtures } from "./loader.js";
import { repoRoot, suitesDir } from "./paths.js";

const FAMILY_DEFAULT_BASES = {
  frontend: "base-react-js",
  api: "base-node",
  fullstack: "base-node",
  repair: "base-ts-lib",
  migration: "base-next-js",
  project: "base-node",
};

export async function caseNew(flags = {}) {
  const root = repoRoot();
  const ecosystem =
    flags.ecosystem ??
    (flags.lang === "python" || flags.language === "python" ? "python" : "js");
  const fixtures = listFixtures(root, ecosystem).filter((f) => f.startsWith("base-"));
  const interactive = !flags.nonInteractive && !flags.category && !flags.slug;
  const ask = interactive ? makeAsk() : null;

  const eco =
    flags.ecosystem ??
    (ask ? await ask("Ecosystem [js/python]", ecosystem) : ecosystem);
  const category =
    flags.category ??
    (ask ? await ask("Category [frontend/api/fullstack/repair/migration]", "frontend") : "frontend");
  const family =
    flags.family ??
    (["api", "fullstack", "repair", "migration", "frontend"].includes(category)
      ? category
      : "frontend");
  const slug =
    flags.slug ??
    (ask ? await ask("Slug (kebab-case)", "my-new-case") : "my-new-case");
  const suggested = FAMILY_DEFAULT_BASES[family] ?? fixtures[0] ?? "base-react-js";
  const basesRaw =
    flags.bases ??
    flags.fixture ??
    (ask
      ? await ask(`Bases (comma-separated) [${fixtures.join(", ")}]`, suggested)
      : suggested);
  const bases = String(basesRaw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const difficulty =
    flags.difficulty ??
    (ask ? await ask("Difficulty [easy/medium/hard]", "easy") : "easy");
  const title =
    flags.title ??
    (ask ? await ask("Title", slug.replace(/-/g, " ")) : slug.replace(/-/g, " "));
  const prompt =
    flags.prompt ??
    (ask
      ? await ask("Prompt (single line)", "Describe the task for the agent.")
      : "Describe the task for the agent.");

  const id = flags.id ?? `${category}-${slug}`;
  const caseDir = join(suitesDir(root), eco, "atomic", category, slug);
  if (existsSync(join(caseDir, "task.yaml"))) {
    throw new Error(`Case already exists: ${caseDir}`);
  }

  mkdirSync(join(caseDir, "resources"), { recursive: true });
  for (const base of bases) {
    mkdirSync(join(caseDir, "resources", "solution", base), { recursive: true });
  }
  // Do NOT create empty grade/*.yaml stubs — add grade/<base>.yaml only when needed.

  const yaml = `id: ${id}
title: ${JSON.stringify(title)}
ecosystem: ${eco}
bases:
${bases.map((b) => `  - ${b}`).join("\n")}
family: ${family}
packages: []
difficulty: ${difficulty}
category: ${category}
language: ${eco === "python" ? "python" : "javascript"}
tags: [${category}]
timeoutSec: 300
promptFile: spec.md
readmeFile: README.md
grade:
  - build: true
`;

  writeFileSync(join(caseDir, "task.yaml"), yaml);
  writeFileSync(join(caseDir, "spec.md"), `${prompt}\n`);
  writeFileSync(
    join(caseDir, "README.md"),
    `# ${title}

## Goal

${prompt}

## Ecosystem

\`${eco}\`

## Bases

${bases.map((b) => `- \`${b}\``).join("\n")}

## How we grade

Shared recipes in \`task.yaml\`. Optional per-base file: \`grade/<base>.yaml\` (create only when paths differ).

## Local verify

\`\`\`bash
pnpm case:validate
pnpm case:dry-run ${id}
\`\`\`
`,
  );

  ask?.close?.();

  return {
    id,
    caseDir,
    message: `Created ${caseDir}\nNext: edit spec.md, add grade/<base>.yaml if needed, add resources/solution/<base>/, then:\n  pnpm case:validate\n  pnpm case:dry-run ${id}`,
  };
}

function makeAsk() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q, def) =>
    new Promise((resolve) => {
      rl.question(`${q}${def ? ` (${def})` : ""}: `, (answer) => {
        resolve(answer.trim() || def || "");
      });
    });
  ask.close = () => rl.close();
  return ask;
}
