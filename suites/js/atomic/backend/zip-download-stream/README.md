# File Compression & Zip Archiver Service

## Goal

Build an endpoint that streams multiple server files into a single ZIP file download using `archiver`.

## Ecosystem

`js` — real-world backend (prompt #61 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `archiver`

```bash
pnpm case:dry-run backend-zip-download-stream
pnpm case:dry-run backend-zip-download-stream@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
