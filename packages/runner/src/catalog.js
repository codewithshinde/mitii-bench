import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { discoverProjects, discoverTasks } from "./loader.js";
import { catalogPath, repoRoot } from "./paths.js";

/** Regenerates catalog/catalog.json (gitignored — always generate via CLI). */
export function buildCatalog(root = repoRoot()) {
  const all = discoverTasks(root);
  const tasks = all.filter((t) => !t.error);
  const errors = all.filter((t) => t.error);
  const projects = discoverProjects(root);

  const catalog = {
    schemaVersion: 3,
    generatedAt: new Date().toISOString(),
    generatedBy: "pnpm case:validate | pnpm catalog",
    count: tasks.length,
    tasks: tasks.map((t) => ({
      id: t.id,
      runId: t.runId,
      title: t.title,
      ecosystem: t.ecosystem,
      base: t.base,
      bases: t.bases,
      family: t.family,
      packages: t.packages ?? [],
      difficulty: t.difficulty,
      category: t.category,
      language: t.language,
      tags: t.tags,
      path: t.relativeDir,
    })),
    projects: projects.map((p) => ({
      projectId: p.projectId,
      ecosystem: p.ecosystem,
      title: p.title,
      steps: p.steps.length,
      path: p.relativeDir,
    })),
    errors: errors.map((e) => ({ path: e.relativeDir, error: e.error })),
  };

  const out = catalogPath(root);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(catalog, null, 2)}\n`);
  return catalog;
}
