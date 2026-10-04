# Contributing

## Where cases live

```text
suites/{ecosystem}/atomic/{category}/{slug}/
  README.md          # required — explain the case
  spec.md            # required — agent prompt
  task.yaml          # bases, family, shared grade
  grade/<base>.yaml  # ONLY if that base needs different file asserts
  resources/solution/<base>/
```

| Ecosystem | Folder | Fixtures |
|---|---|---|
| JavaScript/TS | `suites/js/` | `fixtures/js/base-*` |
| Python (later) | `suites/python/` | `fixtures/python/base-*` |

## Why `grade/` might be empty

`grade/` is **optional**. Create `grade/<base>.yaml` only when asserts differ per base (e.g. `src/App.jsx` vs `app/page.js`). Shared recipes stay in `task.yaml` under `grade:`.

`pnpm case:new` no longer writes empty grade stubs.

## Solution folder vs grades (important)

`resources/solution/<base>/` is a **hand-written known-good implementation** for CI / dry-run only.

`resources/oracle/<base>/` holds **agent-hidden** Vitest + Testing Library behavioral tests. The runner copies them into the workspace only when grading (see [docs/UI_ORACLES.md](./docs/UI_ORACLES.md)).

| | Dry-run | Agent eval |
|---|---|---|
| Workspace edits | Apply `solution/` | Mitii / the agent |
| Scoring | Run **grades** on that workspace | Run the **same grades** |
| Compare to solution? | No — grades only | No — grades only |

Dry-run does **not** generate a solution from grades. It tests: *does this solution pass these grades?*

See [docs/GRADING_AND_DRY_RUN.md](./docs/GRADING_AND_DRY_RUN.md).

## Catalog is auto-generated

Do not hand-edit `catalog/catalog.json` or `catalog/cases.html`. They are gitignored and rebuilt by:

- `pnpm case:validate`
- `pnpm catalog`
- `pnpm install` (postinstall)

## Add a case

```bash
pnpm case:new --yes --ecosystem=js --category=frontend --slug=my-case \
  --bases=base-react-js \
  --prompt='…'
# edit spec.md + README.md
# add resources/solution/<base>/
# add grade/<base>.yaml only if needed
pnpm case:validate
pnpm case:dry-run <id>
```

## Filters

```bash
pnpm cases --ecosystem=js
pnpm cases --family=frontend
pnpm cases --base=base-react-js
pnpm cases --tag=smoke
pnpm case:dry-run frontend-site-nav-pages@base-next-js
```

## Bulk React frontend cases

To regenerate the corpus derived from `references/react-tasks.md`:

```bash
pnpm generate:react-frontend --force
pnpm case:validate
pnpm --filter @mitii-bench/runner bench --dryRun --tag=smoke
```

See [docs/REACT_TASKS.md](./docs/REACT_TASKS.md) for which prompts apply to React vs Next vs library scaffolds.
