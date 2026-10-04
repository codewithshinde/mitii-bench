# Node backend tasks corpus (`references/node-tasks.md`)

Source prompts live in gitignored `references/node-tasks.md` (100 items).  
Generator: `pnpm generate:node-backend` → `scripts/generate-node-backend-cases.mjs`  
Data: `scripts/data/node-backend-meta.mjs`, solutions in `scripts/data/node-core-solutions.mjs`

## Applicability matrix

| Prompt range | Topic | Base | Notes |
|---|---|---|---|
| 1–25 | Node core & async | `base-node` | Vanilla; smoke subset has solutions + `node:test` oracles |
| 26–43, 48–55 | Express / Prisma / Socket / Bull / Fastify / Auth / GraphQL / CLI | `base-node` | `ecosystem-lib` scaffolds (agent installs packages) |
| 44–47 | NestJS | `base-nest-js` | Scaffold on Nest fixture |
| 56–100 | Real-world backend | `base-node` | Vanilla or ecosystem-lib per task |

## Tags

- `vanilla` — no extra packages beyond the fixture
- `ecosystem-lib` — requires third-party packages; scaffold only until solutions land
- `smoke` — CI dry-run subset with known-good solutions
- `node-tasks` — imported from the reference bank
- `node-core` / `realworld` / `nestjs` — topic filters

## Grading strength

| Layer | When |
|---|---|
| `contains` / `exists` | Structural source contracts (routes, APIs, markers) |
| `build: true` | `npm run build` |
| `test: true` | `npm test` — fixture tests + agent-hidden oracles under `resources/oracle/` |
| `http` | Start server and assert status / JSON contracts |

See [GRADING_AND_DRY_RUN.md](./GRADING_AND_DRY_RUN.md).

## Commands

```bash
pnpm generate:node-backend --force     # regenerate all 100
pnpm generate:node-backend --core-only
pnpm case:validate
pnpm --filter @mitii-bench/runner bench --dryRun --tag=smoke --family=api
pnpm case:dry-run backend-crypto-scrypt-password
pnpm cases --family=api --tag=node-tasks
pnpm cases --tag=ecosystem-lib --category=backend
```
