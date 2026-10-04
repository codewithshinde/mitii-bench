# HTTP Server without Frameworks

## Goal

Build a native HTTP server using Node's `http` module.

## Ecosystem

`js` — Node.js core / async (prompt #1 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-http-native-server
pnpm case:dry-run backend-http-native-server@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: HTTP behavioral checks against a started server
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Source: `references/node-tasks.md`.
