# Single Sign-On (SSO) SAML Identity Provider Consumer

## Goal

Build a SAML 2.0 consumer authentication endpoint validating incoming SAML Assertions from an identity provider (e.g., Okta/Ping).

## Ecosystem

`js` — real-world backend (prompt #99 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `passport-saml`

```bash
pnpm case:dry-run backend-saml-sso-consumer
pnpm case:dry-run backend-saml-sso-consumer@base-node
```

## How we grade

- Shared: `npm run build`
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
