# Fixtures (by language ecosystem)

```text
fixtures/
  js/                 # JavaScript / TypeScript bases
    base-react-js/
    base-next-js/
    base-node/
    base-nest-js/
    base-ts-lib/
  python/             # future: base-fastapi, base-django, …
```

Cases under `suites/{ecosystem}/…` resolve bases from `fixtures/{ecosystem}/{base}/`.

| Base (js) | Stack |
|---|---|
| `base-react-js` | Vite + React |
| `base-next-js` | Next.js App Router |
| `base-node` | Express + SQLite |
| `base-nest-js` | NestJS |
| `base-ts-lib` | Small TS package |
