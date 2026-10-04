# Dynamic List Rendering & Key Props

## Goal

Build a dynamic item list where users can add items.

## Ecosystem

`js` — matrix on React (Vite) and Next.js App Router.

## Bases

| Base | Approach |
|---|---|
| `base-react-js` | Client UI in `src/App.jsx` |
| `base-next-js` | Client page in `app/page.jsx` (`"use client"`) |

```bash
pnpm case:dry-run frontend-dynamic-item-list
pnpm case:dry-run frontend-dynamic-item-list@base-react-js
```

## How we grade

- Shared: `npm run build`
- Shared: Vitest + Testing Library `ui_oracle` (behavioral; agent-hidden under `resources/oracle/`)
- Per-base: `data-testid` / marker asserts in source
- `resources/solution/` is dry-run only

Source: `references/react-tasks.md` (vanilla React — no extra packages).
