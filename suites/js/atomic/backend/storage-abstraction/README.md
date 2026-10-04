# File Storage Abstraction Layer (S3 vs Local)

## Goal

Build a storage driver abstraction interface with two implementations: `LocalStorageProvider` and `S3StorageProvider` sharing a common interface (`upload`, `delete`, `getUrl`).

## Ecosystem

`js` — real-world backend (prompt #78 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-storage-abstraction
pnpm case:dry-run backend-storage-abstraction@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
