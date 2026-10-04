# mitii-bench

Open-source Mitii coding-agent evaluation benchmark.

## Layout (language-first)

```text
suites/
  js/atomic/…          # JavaScript / TypeScript cases
  python/atomic/…      # Python later (isolated tree)
fixtures/
  js/base-react-js/…
  python/              # reserved
catalog/               # AUTO-GENERATED (gitignored)
```

Python will not dump into the same `atomic/` as JS — each ecosystem has its own tree.

## Quick start

```bash
pnpm install              # also regenerates catalog/
pnpm fixtures:install
pnpm case:validate        # regenerates catalog/catalog.json + cases.html
pnpm --filter @mitii-bench/runner bench --dryRun --tag=smoke
pnpm cases:open
```

## Frontend corpus

~100 React prompts from `references/react-tasks.md` are under `suites/js/atomic/frontend/`:

- **Vanilla** (core + real-world widgets): matrix on `base-react-js` + `base-next-js`, with dry-run solutions **and Vitest/RTL behavioral oracles**
- **Ecosystem libs** (MUI, Redux, RHF, …): React-first scaffolds (`ecosystem-lib`); agent installs packages
- **Skipped**: React Native Paper (not a web fixture)
- **Next routing**: parallel App Router cases with solutions (`frontend-next-*`)

Details: [docs/REACT_TASKS.md](./docs/REACT_TASKS.md) · [docs/UI_ORACLES.md](./docs/UI_ORACLES.md).

## Grading & dry-run

**Dry-run applies `resources/solution/`, then runs grades** (no LLM).  
**Agent runs never compare to the solution** — only grades decide pass/fail.

Full explanation: [docs/GRADING_AND_DRY_RUN.md](./docs/GRADING_AND_DRY_RUN.md).

## Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [suites/README.md](./suites/README.md).

## License

Apache-2.0
