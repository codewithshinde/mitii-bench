# Multi-Language i18n Translation Middleware

## Goal

Build an internationalization middleware parsing `Accept-Language` headers and injecting locale translation helper `req.__('key')`.

## Ecosystem

`js` — real-world backend (prompt #89 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-i18n-middleware
pnpm case:dry-run backend-i18n-middleware@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
