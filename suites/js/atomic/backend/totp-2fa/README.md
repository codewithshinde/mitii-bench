# Two-Factor Authentication (2FA) TOTP Service

## Goal

Build a 2FA workflow using `speakeasy` and QR codes.

## Ecosystem

`js` — real-world backend (prompt #92 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `speakeasy`
- `qrcode`

```bash
pnpm case:dry-run backend-totp-2fa
pnpm case:dry-run backend-totp-2fa@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
