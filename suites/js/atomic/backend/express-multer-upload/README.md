# Express File Uploads with Multer

## Goal

Build an image upload endpoint using `multer`.

## Ecosystem

`js` — frameworks & ecosystem (prompt #29 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `multer`

```bash
pnpm case:dry-run backend-express-multer-upload
pnpm case:dry-run backend-express-multer-upload@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
