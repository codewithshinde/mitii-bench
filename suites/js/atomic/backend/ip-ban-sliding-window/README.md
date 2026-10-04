# Sliding Window IP Banning System

## Goal

Build a security guard middleware that temporarily bans IPs triggering >10 `401 Unauthorized` responses within a 5-minute window.

## Ecosystem

`js` — real-world backend (prompt #71 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-ip-ban-sliding-window
pnpm case:dry-run backend-ip-ban-sliding-window@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
