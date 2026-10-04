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
pnpm case:dry-run frontend-site-nav-pages
pnpm cases:open
```

## Current case

`frontend-site-nav-pages` — Home / About / Careers in top nav; Terms and Conditions + Privacy Policy in footer; dummy page content. Matrix: `base-react-js` + `base-next-js`.

## Grading & dry-run

**Dry-run applies `resources/solution/`, then runs grades** (no LLM).  
**Agent runs never compare to the solution** — only grades decide pass/fail.

Full explanation: [docs/GRADING_AND_DRY_RUN.md](./docs/GRADING_AND_DRY_RUN.md).

## Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [suites/README.md](./suites/README.md).

## License

Apache-2.0
