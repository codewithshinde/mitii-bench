# Suites layout (language-first)

```text
suites/
  js/                      # JavaScript ecosystem
    atomic/
      frontend/
      api/
      …
    projects/
  python/                  # Python ecosystem (empty until cases land)
    atomic/
    projects/
```

**Why not a single `atomic/`?**  
When Python (or Go) arrives, a flat `atomic/` mixes unrelated stacks and categories explode. Each language keeps its own `atomic/` + `projects/` + matching `fixtures/{lang}/`.

Cross-cutting filters still work: `--family=frontend`, `--base=base-react-js`, `--ecosystem=js`.

## Grading & dry-run

`resources/solution/` is dry-run only (known-good files → grades). Agent runs never compare to it.  
Details: [docs/GRADING_AND_DRY_RUN.md](../docs/GRADING_AND_DRY_RUN.md).

## React frontend corpus

Prompts from `references/react-tasks.md` are materialized under `suites/js/atomic/frontend/`.

- Vanilla React/Next cases ship solutions + grades (matrix on `base-react-js` + `base-next-js`)
- Ecosystem-library cases are React-first scaffolds (`packages` + `ecosystem-lib` tag)
- Regenerator: `pnpm generate:react-frontend` — see [docs/REACT_TASKS.md](../docs/REACT_TASKS.md)

```bash
pnpm cases --tag=vanilla --family=frontend
pnpm cases --tag=ecosystem-lib
pnpm --filter @mitii-bench/runner bench --dryRun --tag=smoke
```
