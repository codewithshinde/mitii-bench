# Winston Logger with File Transport

## Goal

Build a logging configuration using `winston`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #53 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `winston`

```bash
pnpm case:dry-run backend-winston-file-logger
pnpm case:dry-run backend-winston-file-logger@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
