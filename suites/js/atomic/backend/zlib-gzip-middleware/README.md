# Zlib Compression Stream

## Goal

Build an HTTP response compression pipeline using `zlib.createGzip()`.

## Ecosystem

`js` — Node.js core / async (prompt #17 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-zlib-gzip-middleware
pnpm case:dry-run backend-zlib-gzip-middleware@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
