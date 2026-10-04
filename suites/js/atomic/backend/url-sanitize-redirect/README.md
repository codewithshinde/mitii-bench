# URL Parsing & Query Building

## Goal

Build a URL sanitizer utility using native `URL` and `URLSearchParams` classes.

## Ecosystem

`js` — Node.js core / async (prompt #13 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-url-sanitize-redirect
pnpm case:dry-run backend-url-sanitize-redirect@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
