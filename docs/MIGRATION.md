# Migrating from Mitii solid-benchmark

Mitii’s in-repo suite lives at `Mitii/tests/benchmark` (`@mitii/solid-benchmark`).
`mitii-bench` is the public corpus home. Keep both until parity.

Solid fixtures map to **bases** (`next-app` → `base-next-js`, `nest-api` → `base-nest-js`, etc.).
Imported cases must gain `README.md` + `resources/solution/<base>/` before dry-run.
See [GRADING_AND_DRY_RUN.md](./GRADING_AND_DRY_RUN.md) for what dry-run and `solution/` mean.

## Import JSONL → task.yaml

Dry-run first:

```bash
pnpm import:solid --from=../Mitii/tests/benchmark --suite=api-build --limit=5 --dry-run
```

Write folders:

```bash
pnpm import:solid --from=../Mitii/tests/benchmark --suite=frontend --limit=20
pnpm case:validate
```

Imported cases land under `suites/atomic/imported/<suite>/<category>/<slug>/`.
Review grade recipes (especially `command` / `http`) and add `resources/solution/` before relying on dry-run.

## Pin corpus in Mitii CI

See [`.github/workflows/mitii-smoke.example.yml`](../.github/workflows/mitii-smoke.example.yml).

Suggested flow:

1. Tag `mitii-bench` (`v0.1.0`, …)
2. Mitii workflow checks out that tag into `mitii-bench/`
3. Run `pnpm case:validate` + dry-run smoke subset (no paid model)
