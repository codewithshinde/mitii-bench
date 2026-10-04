# Buffer Manipulation & Binary Data

## Goal

Build an image header inspector using `Buffer`.

## Ecosystem

`js` — Node.js core / async (prompt #6 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-buffer-file-type
pnpm case:dry-run backend-buffer-file-type@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `npm test` (agent-hidden oracle and/or case tests)
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Source: `references/node-tasks.md`.
