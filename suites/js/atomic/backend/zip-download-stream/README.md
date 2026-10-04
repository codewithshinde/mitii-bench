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
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
