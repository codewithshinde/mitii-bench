# URL Parsing & Query Building

## Goal

Build a URL sanitizer utility using native `URL` and `URLSearchParams` classes.

## Ecosystem

`js` — Node.js core / async (prompt #13 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-url-sanitize-redirect
pnpm case:dry-run backend-url-sanitize-redirect@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `npm test` (agent-hidden oracle and/or case tests)
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Source: `references/node-tasks.md`.
