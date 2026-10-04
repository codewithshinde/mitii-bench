Build a search result page using Next.js App Router `useSearchParams`.

* **Input** (`data-testid="query-input"`).
* **Behavior**: Typing updates the URL search query (`?q=term`). Read query from URL and display "Results for: [term]" (`data-testid="search-results"`).

Use `next/navigation` `useSearchParams` (and `useRouter` / `usePathname` as needed) in a client component. Wrap with a Suspense boundary if required by Next.
