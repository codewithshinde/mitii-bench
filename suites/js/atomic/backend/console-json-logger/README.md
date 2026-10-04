# Console Object Redirection

## Goal

Build a custom logging wrapper redirecting standard outputs (`process.stdout`, `process.stderr`).

## Ecosystem

`js` — Node.js core / async (prompt #24 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-console-json-logger
pnpm case:dry-run backend-console-json-logger@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
