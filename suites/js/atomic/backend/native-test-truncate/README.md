# Node.js Test Runner (Native `node:test`)

## Goal

Build an automated test file using Node's built-in test runner (`node:test` and `node:assert`).

## Ecosystem

`js` — Node.js core / async (prompt #25 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-native-test-truncate
pnpm case:dry-run backend-native-test-truncate@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
