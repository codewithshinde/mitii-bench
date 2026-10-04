# NestJS Controller & Dependency Injection

## Goal

Build a NestJS `UsersController` injecting a `UsersService`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #44 from `references/node-tasks.md`).

## Bases

- `base-nest-js`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-nest-users-controller
pnpm case:dry-run backend-nest-users-controller@base-nest-js
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
