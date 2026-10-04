# DNS Lookup Module

## Goal

Build a domain network diagnostic function using `node:dns/promises`.

## Ecosystem

`js` — Node.js core / async (prompt #18 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-dns-inspect-domain
pnpm case:dry-run backend-dns-inspect-domain@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
