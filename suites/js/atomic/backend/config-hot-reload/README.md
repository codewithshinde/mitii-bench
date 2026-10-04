# Dynamic Config Reloading without Restart

## Goal

Build a configuration provider that watches a `config.json` file on disk for changes and hot-reloads configuration settings in memory without restarting the Node server.

## Ecosystem

`js` — real-world backend (prompt #84 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-config-hot-reload
pnpm case:dry-run backend-config-hot-reload@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
