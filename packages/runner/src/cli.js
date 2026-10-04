#!/usr/bin/env node
import { discoverProjects, discoverTasks } from "./loader.js";
import { buildCatalog } from "./catalog.js";
import { caseNew } from "./case-new.js";
import { generateCasesBrowser, openCasesBrowser } from "./cases-browser.js";
// catalog + cases.html regenerated together on validate
import { importSolidBenchmark } from "./import-solid.js";
import { dryRunTask, runProject, runTask, validateAll } from "./runner.js";
import { repoRoot } from "./paths.js";

const args = process.argv.slice(2);
const command = args[0];
const flags = parseFlags(args.slice(1));

async function main() {
  switch (command) {
    case "case:validate":
    case "validate": {
      const result = await validateAll();
      buildCatalog();
      const browserPath = generateCasesBrowser();
      if (!result.ok) {
        console.error(`Validation failed (${result.errors.length} errors):`);
        for (const e of result.errors) console.error(`  - ${e.path}: ${e.error}`);
        process.exit(1);
      }
      console.log(
        `OK — ${result.count} matrix instances validated; catalog + ${browserPath} written.`,
      );
      break;
    }
    case "catalog": {
      const catalog = buildCatalog();
      const browserPath = generateCasesBrowser();
      console.log(`Wrote catalog with ${catalog.count} instances + ${browserPath}.`);
      break;
    }
    case "cases": {
      if (flags.open) {
        const path = openCasesBrowser();
        console.log(`Opened ${path}`);
      } else if (flags.search || flags.base || flags.family || flags.package || flags.ecosystem) {
        const tasks = discoverTasks(repoRoot(), {
          search: flags.search,
          base: flags.base,
          family: flags.family,
          package: flags.package,
          ecosystem: flags.ecosystem,
        });
        for (const t of tasks.filter((x) => !x.error)) {
          console.log(
            `${t.runId}\t${t.ecosystem}\t${t.family}\t${t.base}\t${t.title}`,
          );
        }
      } else {
        const path = generateCasesBrowser();
        console.log(`Wrote ${path}`);
      }
      break;
    }
    case "case:new": {
      const created = await caseNew({
        nonInteractive: Boolean(flags.yes || flags.nonInteractive),
        ecosystem: flags.ecosystem,
        category: flags.category,
        family: flags.family,
        slug: flags.slug,
        bases: flags.bases || flags.base,
        fixture: flags.fixture,
        difficulty: flags.difficulty,
        title: flags.title,
        prompt: flags.prompt,
        id: flags.id,
      });
      console.log(created.message);
      break;
    }
    case "case:dry-run": {
      const id = flags._[0] || flags.id;
      if (!id) {
        console.error("Usage: case:dry-run <task-id|task-id@base> [--base=]");
        process.exit(1);
      }
      const ref = flags.base && !id.includes("@") ? `${id}@${flags.base}` : id;
      // If bare id with multiple bases and no --base, dry-run all matrix rows
      const matches = discoverTasks(repoRoot(), {
        id: id.includes("@") ? id.split("@")[0] : id,
        base: flags.base,
      }).filter((t) => !t.error);
      if (!id.includes("@") && !flags.base && matches.length > 1) {
        let failed = 0;
        for (const t of matches) {
          const report = await dryRunTask(t.runId, { keep: flags.keep !== false });
          printReport(report);
          if (!report.passed) failed += 1;
        }
        process.exit(failed ? 1 : 0);
      }
      const report = await dryRunTask(ref, { keep: flags.keep !== false });
      printReport(report);
      process.exit(report.passed ? 0 : 1);
      break;
    }
    case "bench":
    case "run": {
      if (flags.project) {
        const report = await runProject(flags.project, {
          dryRun: Boolean(flags.dryRun),
          stepFrom: flags.stepFrom ? Number(flags.stepFrom) : undefined,
          stepTo: flags.stepTo ? Number(flags.stepTo) : undefined,
          allowSolutionFallback: Boolean(flags.allowSolutionFallback),
          continueOnFail: Boolean(flags.continueOnFail),
        });
        console.log(JSON.stringify(report, null, 2));
        process.exit(report.passed ? 0 : 1);
      }
      const id = flags._[0] || flags.id;
      const filter = {
        category: flags.category,
        tag: flags.tag,
        fixture: flags.fixture,
        base: flags.base,
        family: flags.family,
        package: flags.package,
        ecosystem: flags.ecosystem,
        difficulty: flags.difficulty,
      };
      if (!id) {
        const tasks = discoverTasks(repoRoot(), filter).filter((t) => !t.error);
        let failed = 0;
        for (const t of tasks) {
          const report = flags.dryRun
            ? await dryRunTask(t.runId, { keep: false })
            : await runTask(t.runId, { skipAgent: Boolean(flags.skipAgent) });
          console.log(`${report.passed ? "PASS" : "FAIL"} ${t.runId}`);
          if (!report.passed) failed += 1;
        }
        process.exit(failed ? 1 : 0);
      }
      const ref = flags.base && !String(id).includes("@") ? `${id}@${flags.base}` : id;
      const matches = discoverTasks(repoRoot(), {
        ...filter,
        id: String(id).includes("@") ? String(id).split("@")[0] : id,
      }).filter((t) => !t.error);
      if (!String(id).includes("@") && !flags.base && matches.length > 1) {
        let failed = 0;
        for (const t of matches) {
          const report = flags.dryRun
            ? await dryRunTask(t.runId)
            : await runTask(t.runId, { skipAgent: Boolean(flags.skipAgent) });
          printReport(report);
          if (!report.passed) failed += 1;
        }
        process.exit(failed ? 1 : 0);
      }
      const report = flags.dryRun
        ? await dryRunTask(ref)
        : await runTask(ref, { skipAgent: Boolean(flags.skipAgent) });
      printReport(report);
      process.exit(report.passed ? 0 : 1);
      break;
    }
    case "projects": {
      for (const p of discoverProjects(repoRoot())) {
        console.log(`${p.projectId}\t${p.steps.length} steps\t${p.relativeDir}`);
      }
      break;
    }
    case "import:solid": {
      const result = importSolidBenchmark({
        from: flags.from,
        suite: flags.suite,
        limit: flags.limit ? Number(flags.limit) : Infinity,
        dryRun: Boolean(flags.dryRun),
        root: repoRoot(),
      });
      console.log(
        `${result.dryRun ? "Would import" : "Imported"} ${result.count} cases` +
          (flags.from ? ` from ${flags.from}` : ""),
      );
      for (const item of result.imported.slice(0, 20)) {
        console.log(`  ${item.id} -> ${item.outDir}`);
      }
      if (result.imported.length > 20) console.log(`  … +${result.imported.length - 20} more`);
      break;
    }
    case "help":
    case undefined:
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printReport(report) {
  console.log(
    `${report.passed ? "PASS" : "FAIL"} ${report.id}${report.base ? ` [${report.base}]` : ""} (${report.mode})`,
  );
  for (const c of report.checks ?? []) {
    console.log(
      `  ${c.passed ? "✓" : "✗"} ${c.type}${c.details ? `: ${String(c.details).slice(0, 120)}` : ""}`,
    );
  }
  if (report.workspace) console.log(`workspace: ${report.workspace}`);
}

function printHelp() {
  console.log(`mitii-bench CLI

Commands:
  case:validate              Validate all task.yaml + write catalog
  case:new                   Interactive wizard (or flags)
  case:dry-run <id|id@base>  Apply solution + grade (no LLM); all bases if bare id
  cases [--open] [--search=] Browse / search cases
  bench [--dry-run] [id]     Run agent or dry-run filters
  bench --project=<id>       Cumulative project run
  projects                   List project suites
  catalog                    Regenerate catalog/catalog.json
  import:solid --from=<path> Import solid-benchmark JSONL

Filters:
  --ecosystem=js             Language folder: js|python|…
  --base=base-react-js       Only this base fixture
  --family=frontend          frontend|api|fullstack|repair|migration|project
  --package=mui              Cases declaring packages: [mui]
  --category= --tag= --difficulty=

Flags:
  --bases=base-react-js,base-next-js
  --slug= --prompt= --title= --id= --yes
  --from= --suite= --limit= --dry-run --keep
  --stepFrom= --stepTo= --allow-solution-fallback

Catalog (catalog/catalog.json + cases.html) is auto-generated by
  pnpm case:validate | pnpm catalog | pnpm postinstall
`);
}

function parseFlags(argv) {
  const flags = { _: [] };
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      const [key, ...rest] = arg.slice(2).split("=");
      const value = rest.length ? rest.join("=") : true;
      flags[camel(key)] = value === "false" ? false : value;
    } else {
      flags._.push(arg);
    }
  }
  return flags;
}

function camel(key) {
  return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
