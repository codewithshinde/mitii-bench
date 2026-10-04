# PDF Report Generator Service

## Goal

Build a PDF generation endpoint rendering HTML templates to PDF buffers using `puppeteer` or `pdfkit`.

## Ecosystem

`js` — real-world backend (prompt #83 from `references/node-tasks.md`).

## Bases

- `base-node`

## Packages

- `pdfkit`

```bash
pnpm case:dry-run backend-pdf-invoice-report
pnpm case:dry-run backend-pdf-invoice-report@base-node
```

## How we grade

- Shared: `npm run build`
- Shared: `package_deps` — required packages listed in `package.json`
- Shared: `api_oracle` — agent-hidden `node:test` behavioral suite
- Per-base: HTTP multi-step status / payload / header checks
- Per-base: structural `contains` markers
- `resources/solution/` is dry-run only (never shown to the agent)

Source: `references/node-tasks.md`.
