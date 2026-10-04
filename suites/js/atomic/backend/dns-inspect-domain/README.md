# DNS Lookup Module

## Goal

Build a domain network diagnostic function using `node:dns/promises`.

## Ecosystem

`js` — Node.js core / async (prompt #18 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-dns-inspect-domain
pnpm case:dry-run backend-dns-inspect-domain@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
