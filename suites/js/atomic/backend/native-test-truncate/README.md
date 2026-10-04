# Node.js Test Runner (Native `node:test`)

## Goal

Build an automated test file using Node's built-in test runner (`node:test` and `node:assert`).

## Ecosystem

`js` — Node.js core / async (prompt #25 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-native-test-truncate
pnpm case:dry-run backend-native-test-truncate@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `npm test` (agent-hidden oracle and/or case tests)
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Source: `references/node-tasks.md`.
