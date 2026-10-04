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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
