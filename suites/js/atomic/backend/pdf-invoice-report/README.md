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
- Per-base: source marker asserts in `grade/base-node.yaml`
- `resources/solution/` is dry-run only

Dry-run solution not shipped yet — use agent evals for this case.
Source: `references/node-tasks.md`.
