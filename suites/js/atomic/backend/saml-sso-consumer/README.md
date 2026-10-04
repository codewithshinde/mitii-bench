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
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
