# State Management & Event Handling

## Goal

Build a simple counter component.

## Ecosystem

`js` — matrix on React (Vite) and Next.js App Router.

## Bases

| Base | Approach |
|---|---|
| `base-react-js` | Client UI in `src/App.jsx` |
| `base-next-js` | Client page in `app/page.js` (`"use client"`) |

```bash
pnpm case:dry-run frontend-counter-state
pnpm case:dry-run frontend-counter-state@base-react-js
```

## How we grade

- Shared: `npm run build`
- Per-base: `data-testid` / marker asserts in source
- `resources/solution/` is dry-run only

Source: `references/react-tasks.md` (vanilla React — no extra packages).
