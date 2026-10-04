import { z } from "zod";

const containsGrade = z.object({
  contains: z.object({
    file: z.string().min(1),
    text: z.string().min(1),
  }),
});

const notContainsGrade = z.object({
  notContains: z.object({
    file: z.string().min(1),
    text: z.string().min(1),
  }),
});

const existsGrade = z.object({
  exists: z.object({
    file: z.string().min(1),
  }),
});

const buildGrade = z.object({
  build: z.union([
    z.literal(true),
    z.object({ command: z.string().optional(), timeoutMs: z.number().optional() }),
  ]),
});

const testGrade = z.object({
  test: z.union([
    z.literal(true),
    z.object({ command: z.string().optional(), timeoutMs: z.number().optional() }),
  ]),
});

const commandGrade = z.object({
  command: z.object({
    run: z.string().min(1),
    exitCode: z.number().optional(),
    timeoutMs: z.number().optional(),
    stdoutContains: z.string().optional(),
  }),
});

const httpExpect = z.object({
  status: z.number().optional(),
  bodyContains: z.string().optional(),
  jsonType: z.enum(["array", "object", "string", "number", "boolean", "null"]).optional(),
  jsonSubset: z.unknown().optional(),
  jsonEquals: z.unknown().optional(),
  jsonPaths: z.array(z.string()).optional(),
  headers: z.record(z.string()).optional(),
  headerContains: z.record(z.string()).optional(),
});

const httpRequest = z.object({
  method: z.string().optional(),
  path: z.string().min(1),
  json: z.unknown().optional(),
  headers: z.record(z.string()).optional(),
  expect: httpExpect.optional(),
});

const httpGrade = z.object({
  http: z.object({
    start: z.object({
      command: z.string().min(1),
      env: z.record(z.string()).optional(),
    }),
    request: httpRequest.optional(),
    requests: z.array(httpRequest).optional(),
    expect: httpExpect.optional(),
    timeoutMs: z.number().optional(),
  }),
});

const sqliteGrade = z.object({
  sqlite_query: z.object({
    dbPath: z.string().min(1),
    sql: z.string().min(1),
    column: z.string().optional(),
    row: z.number().optional(),
    equals: z.union([z.string(), z.number(), z.boolean()]).optional(),
    minimum: z.number().optional(),
  }),
});

const uiOracleGrade = z.object({
  ui_oracle: z.object({
    command: z.string().min(1),
    timeoutMs: z.number().optional(),
  }),
});

const apiOracleGrade = z.object({
  api_oracle: z.union([
    z.literal(true),
    z.object({
      command: z.string().optional(),
      timeoutMs: z.number().optional(),
    }),
  ]),
});

const packageDepsGrade = z.object({
  package_deps: z.union([
    z.array(z.string().min(1)),
    z.object({
      packages: z.array(z.string().min(1)).min(1),
      file: z.string().optional(),
    }),
  ]),
});

const workspaceChangedGrade = z.object({
  workspace_changed: z.boolean(),
});

const workspaceUnchangedGrade = z.object({
  workspace_unchanged: z.boolean(),
});

export const GradeItemSchema = z.union([
  containsGrade,
  notContainsGrade,
  existsGrade,
  buildGrade,
  testGrade,
  commandGrade,
  httpGrade,
  sqliteGrade,
  uiOracleGrade,
  apiOracleGrade,
  packageDepsGrade,
  workspaceChangedGrade,
  workspaceUnchangedGrade,
]);

export const FAMILY_VALUES = [
  "frontend",
  "api",
  "fullstack",
  "repair",
  "migration",
  "project",
];

/** Top-level suite language folder: suites/js, suites/python, … */
export const ECOSYSTEM_VALUES = ["js", "python", "go", "java", "rust", "other"];

export const TaskSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    /** Language ecosystem folder under suites/ and fixtures/ */
    ecosystem: z.enum(ECOSYSTEM_VALUES).optional().default("js"),
    /** @deprecated use bases[] */
    fixture: z.string().min(1).optional(),
    bases: z.array(z.string().min(1)).optional(),
    family: z.enum(FAMILY_VALUES).optional().default("frontend"),
    packages: z.array(z.string()).optional().default([]),
    type: z.enum(["atomic", "migration"]).optional().default("atomic"),
    fromBase: z.string().optional(),
    toBase: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    category: z.string().min(1),
    language: z.string().optional().default("javascript"),
    tags: z.array(z.string()).optional().default([]),
    timeoutSec: z.number().int().positive().optional().default(300),
    prompt: z.string().optional(),
    promptFile: z.string().optional().default("spec.md"),
    readmeFile: z.string().optional().default("README.md"),
    rationale: z.string().optional(),
    setup: z
      .object({
        script: z.string().optional(),
        mock: z.string().optional(),
        env: z.record(z.string()).optional(),
      })
      .optional(),
    grade: z.array(GradeItemSchema).optional().default([]),
    agent: z
      .object({
        mode: z.enum(["agent", "ask", "plan"]).optional().default("agent"),
        workspacePolicy: z.string().optional().default("fixture-copy"),
      })
      .optional()
      .default({ mode: "agent", workspacePolicy: "fixture-copy" }),
  })
  .superRefine((t, ctx) => {
    const bases = normalizeBases(t);
    if (bases.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide bases: [..] or legacy fixture: string",
      });
    }
    if (t.type === "migration" && (!t.fromBase || !t.toBase)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "migration tasks require fromBase and toBase",
      });
    }
  });

export function normalizeBases(task) {
  if (Array.isArray(task.bases) && task.bases.length > 0) return [...task.bases];
  if (task.fixture) return [task.fixture];
  if (task.type === "migration" && task.toBase) return [task.toBase];
  return [];
}

export const ManifestSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().optional(),
  ecosystem: z.enum(ECOSYSTEM_VALUES).optional().default("js"),
  language: z.string().optional().default("javascript"),
  cumulative: z.boolean().default(true),
  bases: z.array(z.string()).optional(),
  fixture: z.string().optional(),
  family: z.enum(FAMILY_VALUES).optional().default("project"),
  sequence: z
    .array(
      z.object({
        step: z.number().int().positive(),
        caseDir: z.string().min(1),
        weight: z.number().optional().default(1),
        regression: z.boolean().optional().default(true),
      }),
    )
    .min(1),
});
