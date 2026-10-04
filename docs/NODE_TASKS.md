# Node backend tasks corpus (`references/node-tasks.md`)

Source prompts live in gitignored `references/node-tasks.md` (100 items).  
Generator: `pnpm generate:node-backend` → `scripts/generate-node-backend-cases.mjs`  
Data:

- `scripts/data/node-core-cases.mjs` (1–25)
- `scripts/data/node-ecosystem-cases.mjs` (26–55)
- `scripts/data/node-realworld-cases.mjs` + `node-realworld-solutions.mjs` (56–100)

## Applicability matrix

| Prompt range | Topic | Base | Notes |
|---|---|---|---|
| 1–25 | Node core & async | `base-node` | Vanilla; solutions + `node:test` oracles; HTTP where the contract is an API |
| 26–43, 48–55 | Express / Prisma / Socket / Bull / Fastify / Auth / GraphQL / CLI | `base-node` | `package_deps` + solutions; extra deps mocked or installed only if missing from the fixture |
| 44–47 | NestJS | `base-nest-js` | TypeScript solutions + HTTP |
| 56–100 | Real-world backend | `base-node` | Vanilla or `ecosystem-lib`; Redis/S3/OAuth/SAML mocked in-memory |

## Four grading layers

1. **`contains` / `exists`** — structural source contracts (routes, APIs, markers)
2. **`package_deps`** — required names listed in workspace `package.json` (when `packages:` is non-empty)
3. **`api_oracle`** — agent-hidden `MITII_NO_LISTEN=1 node --test test/oracle.test.js` (happy path + failure/edge)
4. **`http`** — start the server and assert status, JSON payload (`jsonSubset` / `jsonEquals` / `jsonPaths`), and headers. Optional `sidecar` starts a companion process (e.g. mock upstream) and injects its port via `sidecar.portEnv`.

Workspace `npm install` runs **only for packages not already in the fixture `node_modules`**. The `base-node` fixture and solutions gate `listen()` on `MITII_NO_LISTEN` so oracles do not hang.

## Tags

- `vanilla` — no extra packages beyond the fixture
- `ecosystem-lib` — third-party packages declared
- `smoke` — CI dry-run subset
- `node-tasks` — imported from the reference bank

## Commands

```bash
pnpm generate:node-backend --force
pnpm case:validate
pnpm --filter @mitii-bench/runner bench --dryRun --tag=smoke --family=api
pnpm case:dry-run backend-crypto-scrypt-password
pnpm cases --family=api --tag=node-tasks
```
