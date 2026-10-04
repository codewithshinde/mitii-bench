# Buffer Manipulation & Binary Data

## Goal

Build an image header inspector using `Buffer`.

## Ecosystem

`js` — Node.js core / async (prompt #6 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-buffer-file-type
pnpm case:dry-run backend-buffer-file-type@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
