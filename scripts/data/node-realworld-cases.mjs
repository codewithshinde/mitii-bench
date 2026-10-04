/**
 * Real-world Node backend cases (prompts 56–100 from references/node-tasks.md).
 */
import { nodeBackendMeta } from "./node-backend-meta.mjs";
import { realworldSolutions } from "./node-realworld-solutions.mjs";

const SMOKE_SLUGS = new Set([
  "articles-json-crud",
  "webhook-hmac-verify",
  "health-liveness-readiness",
  "feature-flag-manager",
  "data-masking",
  "event-sourcing-store",
]);

function pkgJson(extra = {}) {
  return {
    "package.json":
      JSON.stringify(
        {
          name: "mitii-case-solution",
          version: "1.0.0",
          private: true,
          type: "module",
          scripts: {
            start: "node src/index.js",
            build: 'node -e "console.log(\'build ok\')"',
            test: "node --test test/*.test.js",
          },
          dependencies: {
            express: "^4.21.2",
            "better-sqlite3": "^11.8.1",
            ...extra,
          },
        },
        null,
        2,
      ) + "\n",
  };
}

const PKG_VERSIONS = {
  archiver: "^7.0.1",
  "node-cron": "^3.0.3",
  "@faker-js/faker": "^9.0.0",
  pdfkit: "^0.15.0",
  speakeasy: "^2.0.0",
  qrcode: "^1.5.4",
  "http-proxy-middleware": "^3.0.0",
  "prom-client": "^15.1.0",
  "passport-saml": "^3.2.4",
  pino: "^9.0.0",
  zod: "^3.23.0",
  ioredis: "^5.4.0",
  redlock: "^5.0.0",
  "socket.io": "^4.7.0",
};

export const nodeRealworldCases = nodeBackendMeta
  .filter((m) => m.kind === "realworld")
  .sort((a, b) => a.n - b.n)
  .map((meta) => {
    const sol = realworldSolutions[meta.slug];
    if (!sol) {
      throw new Error(`Missing realworld solution for slug: ${meta.slug}`);
    }
    const deps = {};
    for (const p of meta.packages ?? []) {
      deps[p] = PKG_VERSIONS[p] ?? "*";
    }
    const files = {
      ...(meta.packages?.length ? pkgJson(deps) : {}),
      ...sol.files,
    };
    return {
      n: meta.n,
      slug: meta.slug,
      title: meta.title,
      difficulty: meta.difficulty,
      tags: meta.tags,
      packages: meta.packages,
      bases: meta.bases,
      gradeFile: meta.gradeFile,
      markers: meta.markers,
      files,
      oracle: sol.oracle,
      http: sol.http ?? null,
      smoke: sol.smoke ?? SMOKE_SLUGS.has(meta.slug),
    };
  });
