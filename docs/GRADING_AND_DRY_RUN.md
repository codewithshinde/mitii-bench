# Grading, solutions, and dry-run

This page explains how evaluation works in mitii-bench — especially what `resources/solution/` is for, and what it is **not**.

## Two different runs

| Mode | Command | Who edits the workspace? | How pass/fail is decided |
|---|---|---|---|
| **Dry-run** (no LLM) | `pnpm case:dry-run <id>` | Harness applies `resources/solution/<base>/` | Same **grade** recipes |
| **Agent run** (real eval) | `pnpm bench <id>` (+ Mitii) | Mitii / the coding agent | Same **grade** recipes |

Grades never “diff against the solution folder.”  
They assert properties of the **workspace** after edits (file contents, HTTP, SQLite, build, …).

---

## What `resources/solution/` is

A **hand-written known-good implementation** for that case + base.

Used only so contributors and CI can prove:

> If the code is correct, our grades pass — without calling an LLM.

The agent **never** sees this folder during a real benchmark run. It is agent-hidden.

Typical layout:

```text
suites/js/atomic/frontend/site-nav-pages/
  resources/solution/
    base-react-js/src/App.jsx
    base-next-js/app/...
```

---

## Dry-run flow (correct mental model)

```text
1. Copy base fixture  →  isolated workspace
2. Apply solution/    →  overwrite with known-good files
3. Run grade checks   →  pass/fail on that workspace
```

So:

**Dry-run = test the grades against the solution folder**  
(not “generate a solution from the grades,” and not “score the AI”).

```bash
pnpm case:dry-run frontend-site-nav-pages
pnpm case:dry-run frontend-site-nav-pages@base-react-js
```

---

## Agent run flow

```text
1. Copy base fixture  →  isolated workspace
2. Run Mitii with spec.md as the prompt
3. Run the same grade checks on whatever the agent produced
```

`solution/` is **not** applied and **not** compared to the agent’s tree.

---

## What the CLI does *not* do

- It does **not** invent `solution/` from `grade/*.yaml`
- It does **not** call an AI during dry-run
- It does **not** require the agent’s dummy page text to match the solution’s wording

---

## Writing grades (especially “dummy content”)

Grade only what the prompt contracts — usually exact labels and behavior.

| Prefer grading | Avoid grading |
|---|---|
| Nav labels: Home, About, Careers | Exact dummy paragraph copy |
| Footer labels: Terms and Conditions, Privacy Policy | Solution-specific phrases like “About page dummy…” |
| Mounts: `data-testid="main-nav"` | Full file equality with `solution/` |
| Route/file exists (Next) + build | Brittle internal structure |

Open-ended body text should stay loose (e.g. page exists / heading includes `About`), so any reasonable agent wording can pass.

---

## Contributor checklist

1. Write `spec.md` (prompt) and `README.md` (human explanation).  
2. Write **grades** that match the prompt contract.  
3. Optionally write **`resources/solution/<base>/`** so `pnpm case:dry-run` can validate the grades.  
4. Run `pnpm case:validate` then `pnpm case:dry-run <id>`.  
5. Real scores come from `pnpm bench` with Mitii — grades only, no solution compare.
