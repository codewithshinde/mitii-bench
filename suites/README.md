# Suites layout (language-first)

```text
suites/
  js/                      # JavaScript ecosystem
    atomic/
      frontend/
      api/
      …
    projects/
  python/                  # Python ecosystem (empty until cases land)
    atomic/
    projects/
```

**Why not a single `atomic/`?**  
When Python (or Go) arrives, a flat `atomic/` mixes unrelated stacks and categories explode. Each language keeps its own `atomic/` + `projects/` + matching `fixtures/{lang}/`.

Cross-cutting filters still work: `--family=frontend`, `--base=base-react-js`, `--ecosystem=js`.

## Grading & dry-run

`resources/solution/` is dry-run only (known-good files → grades). Agent runs never compare to it.  
Details: [docs/GRADING_AND_DRY_RUN.md](../docs/GRADING_AND_DRY_RUN.md).
