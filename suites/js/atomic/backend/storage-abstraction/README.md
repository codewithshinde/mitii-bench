# File Storage Abstraction Layer (S3 vs Local)

## Goal

Build a storage driver abstraction interface with two implementations: `LocalStorageProvider` and `S3StorageProvider` sharing a common interface (`upload`, `delete`, `getUrl`).

## Ecosystem

`js` — real-world backend (prompt #78 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture._

```bash
pnpm case:dry-run backend-storage-abstraction
pnpm case:dry-run backend-storage-abstraction@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
