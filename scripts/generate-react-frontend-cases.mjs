#!/usr/bin/env node
/**
 * Materialize references/react-tasks.md into suites/js/atomic/frontend/* cases.
 *
 * Vanilla cases (core + real-world): React + Next matrix with solutions + grades.
 * Library cases: React-first scaffolds (packages tagged); Next-native routing variants.
 * Skips site-nav-pages (prompt #100, already present).
 * Skips React Native Paper (prompt #31, not a web fixture).
 */
import { mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { coreCases } from "./data/react-core-cases.mjs";
import { realworldCases } from "./data/react-realworld-cases.mjs";
import { libraryCases } from "./data/react-library-cases.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const frontendRoot = join(root, "suites", "js", "atomic", "frontend");

const FORCE = process.argv.includes("--force");
const VANILLA_ONLY = process.argv.includes("--vanilla-only");
const LIB_ONLY = process.argv.includes("--lib-only");

function yamlQuote(s) {
  return JSON.stringify(s);
}

function toNextPage(reactSource) {
  let src = reactSource.trim();
  if (!src.startsWith("'use client'") && !src.startsWith('"use client"')) {
    src = `'use client';\n\n${src}`;
  }
  src = src
    .replace(/export\s+function\s+App\s*\(/, "export default function Page(")
    .replace(/export\s+const\s+App\s*=/, "const Page =")
    .replace(/export\s+\{\s*App\s*\}/, "export default Page");
  if (!/export\s+default/.test(src) && /const Page\s*=/.test(src)) {
    src += "\n\nexport default Page;\n";
  }
  return src.endsWith("\n") ? src : `${src}\n`;
}

function toNextExtraPath(relPath) {
  if (relPath === "index.html") return null;
  if (relPath.startsWith("src/")) return `components/${relPath.slice(4)}`;
  return relPath;
}

function rewriteImportsForNext(source, extraFiles = {}) {
  let out = source;
  for (const rel of Object.keys(extraFiles)) {
    if (!rel.startsWith("src/")) continue;
    const name = rel.slice(4); // e.g. Overview.jsx
    const nextFrom = `../components/${name}`;
    out = out
      .replaceAll(`from "./${name}"`, `from "${nextFrom}"`)
      .replaceAll(`from './${name}'`, `from '${nextFrom}'`)
      .replaceAll(`import("./${name}")`, `import("${nextFrom}")`)
      .replaceAll(`import('./${name}')`, `import('${nextFrom}')`);
  }
  return out;
}

/** Dynamic testids like todo-check-[id] are stored as prefixes ending in "-". */
function gradeTextForTestid(id) {
  if (id.endsWith("-") || id.includes("[") || id.includes("*")) {
    const prefix = id.replace(/\[.*?\]/g, "").replace(/\*/g, "");
    return prefix;
  }
  return `data-testid="${id}"`;
}

function gradeYaml(file, testids, markers) {
  const lines = [];
  const seen = new Set();
  for (const id of testids) {
    const text = gradeTextForTestid(id);
    if (seen.has(text)) continue;
    seen.add(text);
    lines.push("- contains:");
    lines.push(`    file: ${file}`);
    lines.push(`    text: ${yamlQuote(text)}`);
  }
  for (const m of markers ?? []) {
    if (seen.has(m)) continue;
    seen.add(m);
    lines.push("- contains:");
    lines.push(`    file: ${file}`);
    lines.push(`    text: ${yamlQuote(m)}`);
  }
  return `${lines.join("\n")}\n`;
}

/** Explicit multi-file grade asserts: [{ contains: { file, text } } | { exists: { file } }] */
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
    writeFileSync(abs, content.endsWith("\n") ? content : `${content}\n`);
  }
  return true;
}

function materializeVanilla(c) {
  const bases = ["base-react-js", "base-next-js"];
  const id = `frontend-${c.slug}`;
  const caseDir = join(frontendRoot, c.slug);
  const smokeSlugs = new Set([
    "counter-state",
    "login-form",
    "todo-crud",
    "theme-context",
    "status-badge",
  ]);
  const tags = [
    ...new Set([
      ...(c.tags ?? []),
      "react-tasks",
      "vanilla",
      ...(smokeSlugs.has(c.slug) ? ["smoke"] : []),
    ]),
  ];

  const taskYaml = `id: ${id}
title: ${yamlQuote(c.title)}
ecosystem: js
bases:
  - base-react-js
  - base-next-js
family: frontend
packages: []
difficulty: ${c.difficulty}
category: frontend
language: javascript
tags: [${tags.map((t) => yamlQuote(t)).join(", ")}]
timeoutSec: 300
promptFile: spec.md
readmeFile: README.md
grade:
  - build: true
`;

  const readme = `# ${c.title}

## Goal

${c.prompt.split("\n")[0]}

## Ecosystem

\`js\` — matrix on React (Vite) and Next.js App Router.

## Bases

| Base | Approach |
|---|---|
| \`base-react-js\` | Client UI in \`src/App.jsx\` |
| \`base-next-js\` | Client page in \`app/page.js\` (\`"use client"\`) |

\`\`\`bash
pnpm case:dry-run ${id}
pnpm case:dry-run ${id}@base-react-js
\`\`\`

## How we grade

- Shared: \`npm run build\`
- Per-base: \`data-testid\` / marker asserts in source
- \`resources/solution/\` is dry-run only

Source: \`references/react-tasks.md\` (vanilla React — no extra packages).
`;

  const nextPage = rewriteImportsForNext(
    toNextPage(c.reactSolution),
    c.reactExtraFiles ?? {},
  );
  const files = {
    "task.yaml": taskYaml,
    "spec.md": `${c.prompt.trim()}\n`,
    "README.md": readme,
    "grade/base-react-js.yaml": gradeYaml("src/App.jsx", c.testids, c.markers),
    "grade/base-next-js.yaml": gradeYaml("app/page.js", c.testids, c.markers),
    "resources/solution/base-react-js/src/App.jsx": c.reactSolution,
    "resources/solution/base-next-js/app/page.js": nextPage,
  };

  for (const [rel, content] of Object.entries(c.reactExtraFiles ?? {})) {
    files[`resources/solution/base-react-js/${rel}`] = content;
    const nextRel = toNextExtraPath(rel);
    if (nextRel) {
      let nextContent = content;
      if (nextRel.endsWith(".jsx") || nextRel.endsWith(".js")) {
        if (!nextContent.includes("use client") && /export/.test(nextContent)) {
          nextContent = `'use client';\n\n${nextContent}`;
        }
      }
      files[`resources/solution/base-next-js/${nextRel}`] = nextContent;
      // Grade that lazy child modules exist when provided
      if (nextRel.startsWith("components/")) {
        // already covered by page imports / testids
      }
    }
  }

  // Portal case: Next needs modal-root in layout
  if (c.slug === "portal-tooltip") {
    files["resources/solution/base-next-js/app/layout.js"] = `export const metadata = {
  title: "Portal Tooltip",
  description: "mitii-bench",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Segoe UI, system-ui, sans-serif" }}>
        {children}
        <div id="modal-root" />
      </body>
    </html>
  );
}
`;
  }

  const wrote = writeCaseDir(caseDir, files);
  return { id, bases, wrote, kind: "vanilla" };
}

function materializeLibrary(c) {
  const bases = c.bases?.length ? c.bases : ["base-react-js"];
  const id = `frontend-${c.slug}`;
  const caseDir = join(frontendRoot, c.slug);
  const tags = [
    ...new Set([...(c.tags ?? []), "react-tasks", ...(c.packages?.length ? ["ecosystem-lib"] : [])]),
  ];
  const packages = c.packages ?? [];

  const taskYaml = `id: ${id}
title: ${yamlQuote(c.title)}
ecosystem: js
bases:
${bases.map((b) => `  - ${b}`).join("\n")}
family: frontend
packages: [${packages.map((p) => yamlQuote(p)).join(", ")}]
difficulty: ${c.difficulty}
category: frontend
language: javascript
tags: [${tags.map((t) => yamlQuote(t)).join(", ")}]
timeoutSec: 300
promptFile: spec.md
readmeFile: README.md
grade:
  - build: true
`;

  const primaryBase = bases[0];
  const gradeFile =
    primaryBase === "base-next-js" ? "app/page.js" : "src/App.jsx";

  const readme = `# ${c.title}

## Goal

${c.prompt.split("\n")[0]}

## Ecosystem

\`js\`

## Bases

${bases.map((b) => `- \`${b}\``).join("\n")}

## Packages

${packages.length ? packages.map((p) => `- \`${p}\``).join("\n") : "_None (framework built-ins)._"}

${
  packages.length
    ? `Install required libraries in the workspace before the app builds. Dry-run solutions are not shipped yet for ecosystem-lib cases — use agent evals.`
    : `Vanilla Next.js App Router APIs (no extra packages).`
}

\`\`\`bash
pnpm case:validate
# dry-run once resources/solution/${primaryBase}/ exists:
# pnpm case:dry-run ${id}
\`\`\`

Source: \`references/react-tasks.md\`.
`;

  const files = {
    "task.yaml": taskYaml,
    "spec.md": `${c.prompt.trim()}\n`,
    "README.md": readme,
    [`grade/${primaryBase}.yaml`]: c.gradeAsserts?.length
      ? gradeFromAsserts(c.gradeAsserts)
      : gradeYaml(gradeFile, c.testids, c.markers),
  };
  for (const base of bases) {
    if (c.solutionFiles && Object.keys(c.solutionFiles).length > 0) {
      for (const [rel, content] of Object.entries(c.solutionFiles)) {
        files[`resources/solution/${base}/${rel}`] = content;
      }
    } else {
      files[`resources/solution/${base}/.gitkeep`] = "";
    }
  }

  const wrote = writeCaseDir(caseDir, files);
  return { id, bases, wrote, kind: "library" };
}

function main() {
  const results = [];
  if (!LIB_ONLY) {
    for (const c of [...coreCases, ...realworldCases]) {
      results.push(materializeVanilla(c));
    }
  }
  if (!VANILLA_ONLY) {
    for (const c of libraryCases) {
      results.push(materializeLibrary(c));
    }
  }

  const wrote = results.filter((r) => r.wrote).length;
  const skipped = results.length - wrote;
  console.log(
    `Materialized ${wrote} cases (${skipped} skipped). Vanilla+lib total defs: ${results.length}`,
  );
  console.log(
    `Vanilla with solutions: ${results.filter((r) => r.kind === "vanilla" && r.wrote).length}`,
  );
  console.log(
    `Library scaffolds: ${results.filter((r) => r.kind === "library" && r.wrote).length}`,
  );
}

main();
