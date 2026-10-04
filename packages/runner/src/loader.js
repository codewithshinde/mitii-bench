import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import { ManifestSchema, TaskSchema, normalizeBases } from "@mitii-bench/schema";
import { compileGrade } from "./grade-compiler.js";
import { fixturesDir, suitesDir } from "./paths.js";

/**
 * Layout:
 *   suites/{ecosystem}/atomic/{category}/{slug}/task.yaml
 *   suites/{ecosystem}/projects/{id}/manifest.json
 *   fixtures/{ecosystem}/{base}/
 */
export function discoverTasks(root, filters = {}) {
  const suites = suitesDir(root);
  const tasks = [];
  walk(suites, (dir) => {
    const taskPath = join(dir, "task.yaml");
    if (!existsSync(taskPath)) return;
    try {
      const family = loadTaskFamily(dir, root);
      for (const instance of expandMatrix(family, filters)) {
        if (matchesFilters(instance, filters)) tasks.push(instance);
      }
    } catch (error) {
      tasks.push({
        error: error.message,
        caseDir: dir,
        relativeDir: relative(root, dir),
      });
    }
  });
  return tasks.sort((a, b) => (a.runId ?? a.id ?? "").localeCompare(b.runId ?? b.id ?? ""));
}

export function loadTaskDir(caseDir, root, baseOverride) {
  const family = loadTaskFamily(caseDir, root);
  const bases = normalizeBases(family);
  const base = baseOverride ?? bases[0];
  if (!bases.includes(base)) {
    throw new Error(`Base ${base} not in matrix for ${family.id}: ${bases.join(", ")}`);
  }
  return materializeInstance(family, base, root);
}

export function loadTaskFamily(caseDir, root) {
  const taskPath = join(caseDir, "task.yaml");
  if (!existsSync(taskPath)) throw new Error(`Missing task.yaml in ${caseDir}`);
  const raw = parseYaml(readFileSync(taskPath, "utf8"));
  const inferredEco = inferEcosystemFromPath(caseDir, root);
  if (!raw.ecosystem && inferredEco) raw.ecosystem = inferredEco;

  const parsed = TaskSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Invalid task.yaml in ${caseDir}: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
    );
  }
  const task = parsed.data;
  const bases = normalizeBases(task);
  const readmeFile = task.readmeFile ?? "README.md";
  const promptFile = task.promptFile ?? "spec.md";
  if (!existsSync(join(caseDir, readmeFile))) {
    throw new Error(`Missing ${readmeFile} (required case explanation)`);
  }
  let prompt = task.prompt ?? "";
  if (!prompt) {
    const promptPath = join(caseDir, promptFile);
    if (!existsSync(promptPath)) {
      throw new Error(`Missing ${promptFile} (agent prompt) or inline prompt:`);
    }
    prompt = readFileSync(promptPath, "utf8");
  }
  for (const base of bases) {
    const fixturePath = resolveFixturePath(root, task.ecosystem, base);
    if (!fixturePath) {
      throw new Error(
        `Base fixture not found: ${base} (looked under fixtures/${task.ecosystem}/ and fixtures/)`,
      );
    }
  }
  return {
    ...task,
    bases,
    prompt,
    readmePath: join(caseDir, readmeFile),
    caseDir,
    relativeDir: relative(root, caseDir),
  };
}

export function resolveFixturePath(root, ecosystem, base) {
  const candidates = [
    join(fixturesDir(root), ecosystem, base),
    join(fixturesDir(root), base),
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  return null;
}

export function expandMatrix(family, filters = {}) {
  let bases = [...family.bases];
  if (filters.base) bases = bases.filter((b) => b === filters.base);
  if (filters.family && family.family !== filters.family) return [];
  if (filters.ecosystem && family.ecosystem !== filters.ecosystem) return [];
  if (filters.package) {
    const pkgs = family.packages ?? [];
    if (!pkgs.includes(filters.package)) return [];
  }
  return bases.map((base) => materializeInstance(family, base, null));
}

function materializeInstance(family, base, rootHint) {
  const root = rootHint ?? inferRoot(family.caseDir);
  const fixturePath = resolveFixturePath(root, family.ecosystem, base);
  const gradeItems = loadGradeForBase(family, base);
  if (gradeItems.length === 0) {
    throw new Error(
      `No grade recipes for ${family.id}@${base} — add grade: in task.yaml or grade/${base}.yaml`,
    );
  }
  const checks = compileGrade(gradeItems);
  const multi = family.bases.length > 1;
  const runId = multi ? `${family.id}@${base}` : family.id;
  const perBaseSolution = join(family.caseDir, "resources", "solution", base);
  const legacySolution = join(family.caseDir, "resources", "solution");
  return {
    ...family,
    base,
    fixture: base,
    fixturePath,
    runId,
    id: family.id,
    instanceId: runId,
    checks,
    gradeItems,
    solutionDir: existsSync(perBaseSolution) ? perBaseSolution : legacySolution,
    solutionPatch: join(family.caseDir, "resources", "solution.patch"),
  };
}

function loadGradeForBase(family, base) {
  const shared = Array.isArray(family.grade) ? [...family.grade] : [];
  const perBasePath = join(family.caseDir, "grade", `${base}.yaml`);
  if (!existsSync(perBasePath)) return shared;
  const raw = parseYaml(readFileSync(perBasePath, "utf8"));
  const items = Array.isArray(raw) ? raw : raw?.grade;
  if (!Array.isArray(items)) {
    throw new Error(`grade/${base}.yaml must be a YAML list or { grade: [...] }`);
  }
  // Ignore empty stub files (comments-only → null/empty)
  if (items.length === 0) return shared;
  return [...shared, ...items];
}

function inferEcosystemFromPath(caseDir, root) {
  const rel = relative(suitesDir(root), caseDir).replaceAll("\\", "/");
  const first = rel.split("/")[0];
  if (["js", "python", "go", "java", "rust", "other"].includes(first)) return first;
  return null;
}

function inferRoot(caseDir) {
  let dir = caseDir;
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(dir, "pnpm-workspace.yaml")) && existsSync(join(dir, "suites"))) {
      return dir;
    }
    const parent = join(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

export function discoverProjects(root) {
  const suites = suitesDir(root);
  if (!existsSync(suites)) return [];
  const projects = [];
  for (const eco of readdirSync(suites)) {
    const projectsRoot = join(suites, eco, "projects");
    if (!existsSync(projectsRoot) || !statSync(projectsRoot).isDirectory()) continue;
    for (const entry of readdirSync(projectsRoot)) {
      const dir = join(projectsRoot, entry);
      if (!statSync(dir).isDirectory()) continue;
      if (!existsSync(join(dir, "manifest.json"))) continue;
      projects.push(loadProject(dir, root));
    }
  }
  return projects;
}

export function loadProject(projectDir, root) {
  const manifestPath = join(projectDir, "manifest.json");
  const raw = JSON.parse(readFileSync(manifestPath, "utf8"));
  const inferredEco = inferEcosystemFromPath(projectDir, root);
  if (!raw.ecosystem && inferredEco) raw.ecosystem = inferredEco;
  const parsed = ManifestSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Invalid manifest.json in ${projectDir}: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
    );
  }
  const manifest = parsed.data;
  const projectBase =
    (manifest.bases && manifest.bases[0]) || manifest.fixture || null;
  const steps = manifest.sequence
    .slice()
    .sort((a, b) => a.step - b.step)
    .map((step) => {
      const caseDir = join(projectDir, step.caseDir);
      const family = loadTaskFamily(caseDir, root);
      const base =
        projectBase && family.bases.includes(projectBase)
          ? projectBase
          : family.bases[0];
      return { ...step, task: materializeInstance(family, base, root) };
    });
  return {
    ...manifest,
    projectDir,
    relativeDir: relative(root, projectDir),
    steps,
  };
}

function matchesFilters(task, filters) {
  if (task.error) return true;
  if (filters.id) {
    const want = filters.id;
    if (task.id !== want && task.runId !== want && task.instanceId !== want) return false;
  }
  if (filters.category && task.category !== filters.category) return false;
  if (filters.fixture && task.fixture !== filters.fixture && task.base !== filters.fixture) {
    return false;
  }
  if (filters.base && task.base !== filters.base) return false;
  if (filters.family && task.family !== filters.family) return false;
  if (filters.ecosystem && task.ecosystem !== filters.ecosystem) return false;
  if (filters.package && !(task.packages ?? []).includes(filters.package)) return false;
  if (filters.difficulty && task.difficulty !== filters.difficulty) return false;
  if (filters.tag && !(task.tags ?? []).includes(filters.tag)) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const hay =
      `${task.id} ${task.runId} ${task.title} ${task.prompt} ${task.base} ${task.ecosystem} ${(task.tags ?? []).join(" ")}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function walk(dir, onDir) {
  if (!existsSync(dir)) return;
  onDir(dir);
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "resources" || entry === "grade") continue;
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, onDir);
  }
}

export function listFixtures(root, ecosystem) {
  const dir = fixturesDir(root);
  if (!existsSync(dir)) return [];
  const out = [];
  const ecos = ecosystem
    ? [ecosystem]
    : readdirSync(dir).filter((n) => statSync(join(dir, n)).isDirectory() && !n.startsWith("."));
  for (const eco of ecos) {
    const ecoDir = join(dir, eco);
    // legacy flat base-* at fixtures root
    if (eco.startsWith("base-")) {
      out.push(eco);
      continue;
    }
    if (!existsSync(ecoDir) || !statSync(ecoDir).isDirectory()) continue;
    for (const name of readdirSync(ecoDir)) {
      if (statSync(join(ecoDir, name)).isDirectory() && !name.startsWith(".")) {
        out.push(name);
      }
    }
  }
  // also scan flat fixtures/
  for (const name of readdirSync(dir)) {
    if (name.startsWith("base-") && statSync(join(dir, name)).isDirectory()) {
      if (!out.includes(name)) out.push(name);
    }
  }
  return out.sort();
}

export function parseTaskRef(ref) {
  if (!ref) return { id: null, base: null };
  const at = ref.lastIndexOf("@");
  if (at <= 0) return { id: ref, base: null };
  return { id: ref.slice(0, at), base: ref.slice(at + 1) };
}
