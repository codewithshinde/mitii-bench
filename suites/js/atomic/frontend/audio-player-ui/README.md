# Audio Player UI

## Goal

Build a mini custom audio player interface.

## Ecosystem

`js` — matrix on React (Vite) and Next.js App Router.

## Bases

| Base | Approach |
|---|---|
| `base-react-js` | Client UI in `src/App.jsx` |
| `base-next-js` | Client page in `app/page.js` (`"use client"`) |

```bash
pnpm case:dry-run frontend-audio-player-ui
pnpm case:dry-run frontend-audio-player-ui@base-react-js
```

## How we grade

- Shared: `npm run build`
- Per-base: `data-testid` / marker asserts in source
- `resources/solution/` is dry-run only

Source: `references/react-tasks.md` (vanilla React — no extra packages).
