# Webhook Ingestion & Signature Verification

## Goal

Build an incoming webhook handler (e.g., Stripe style).

## Ecosystem

`js` — real-world backend (prompt #58 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

_None beyond the base fixture (vanilla / core APIs)._

```bash
pnpm case:dry-run backend-webhook-hmac-verify
pnpm case:dry-run backend-webhook-hmac-verify@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
