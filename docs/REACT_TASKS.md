# React tasks corpus (`references/react-tasks.md`)

Source prompts live in gitignored `references/react-tasks.md` (100 items).  
Generator: `pnpm generate:react-frontend` → `scripts/generate-react-frontend-cases.mjs`  
Data: `scripts/data/react-{core,realworld,library}-cases.mjs`

## Applicability matrix

| Prompt range | Topic | React (`base-react-js`) | Next (`base-next-js`) | Notes |
|---|---|---|---|---|
| 1–25 | React core | Yes + dry-run solutions | Yes (client `"use client"`) | Vanilla only |
| 26–30, 32 | UI libs (MUI/Chakra/antd/Radix/Headless) | Scaffold (`packages` tagged) | No | Needs npm packages; no dry-run solution yet |
| 31 | React Native Paper | **Skipped** | **Skipped** | Not a web fixture |
| 33–36 | React Router | Scaffold (`react-router`) | Parallel Next-native cases | `next-basic-nav`, `next-dynamic-params`, `next-protected-route`, `next-search-params` have solutions |
| 37–55 | Redux/Zustand/Query/RHF/etc. | Scaffold (`ecosystem-lib`) | No | Agent must install packages |
| 56–99 | Real-world UI widgets | Yes + dry-run solutions | Yes | Vanilla |
| 100 | BenchApp site shell | Yes | Yes | Existing `frontend-site-nav-pages` |

## Tags

- `vanilla` — no extra packages; dry-run solutions shipped
- `ecosystem-lib` — requires third-party packages; scaffold only
- `smoke` — CI dry-run subset
- `react-tasks` — imported from the reference bank

## Commands

```bash
pnpm generate:react-frontend --force          # regenerate all
pnpm generate:react-frontend --vanilla-only   # core + real-world only
pnpm case:validate
pnpm --filter @mitii-bench/runner bench --dryRun --tag=smoke
pnpm case:dry-run frontend-counter-state     # one case, all bases
pnpm cases --tag=vanilla --family=frontend
pnpm cases --tag=ecosystem-lib
```
