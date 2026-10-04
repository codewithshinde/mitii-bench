# Behavioral UI oracles (Vitest + Testing Library)

Vanilla frontend cases are graded with **runtime behavior**, not only source substrings.

## What runs

Each vanilla case `task.yaml` includes:

```yaml
grade:
  - build: true
  - ui_oracle:
      command: "npm test -- __bench__/ui.oracle.test.jsx"
      timeoutMs: 60000
```

Plus per-base `contains` / `exists` asserts.

## Agent-hidden oracles

Oracle tests live under:

```text
suites/.../resources/oracle/<base>/__bench__/ui.oracle.test.jsx
```

The runner copies them into the workspace **only at grade time** (after the agent finishes / after dry-run applies `solution/`). Agents never see `__bench__/` during coding.

## Fixture tooling

| Fixture | Runner |
|---|---|
| `base-react-js` | Vitest + jsdom + Testing Library (`npm test`) |
| `base-next-js` | Same; client pages should be `app/page.jsx` for Vitest JSX |

Global `cleanup()` runs in `vitest.setup.*` after each test.

## Regenerating

Oracles are authored in:

- `scripts/data/react-core-oracles.mjs`
- `scripts/data/react-realworld-oracles.mjs`

```bash
pnpm generate:react-frontend --force --vanilla-only
pnpm case:dry-run frontend-counter-state
pnpm --filter @mitii-bench/runner bench --dryRun --tag=smoke
```

## Library cases

`ecosystem-lib` scaffolds do **not** ship oracles yet (extra packages required). Add package installs + oracles when those cases get solutions.
