# Multi-Language i18n Translation Middleware

## Goal

Build an internationalization middleware parsing `Accept-Language` headers and injecting locale translation helper `req.__('key')`.

## Ecosystem

`js` — real-world backend (prompt #89 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-i18n-middleware
pnpm case:dry-run backend-i18n-middleware@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
