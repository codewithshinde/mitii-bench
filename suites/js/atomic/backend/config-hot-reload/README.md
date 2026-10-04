# Dynamic Config Reloading without Restart

## Goal

Build a configuration provider that watches a `config.json` file on disk for changes and hot-reloads configuration settings in memory without restarting the Node server.

## Ecosystem

`js` — real-world backend (prompt #84 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-config-hot-reload
pnpm case:dry-run backend-config-hot-reload@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
