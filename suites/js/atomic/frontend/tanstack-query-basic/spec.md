Fetch a list of posts using TanStack Query `useQuery`.

* **Loading UI** (`data-testid="rq-loading"`).
* **Data UI** (`data-testid="rq-data"`).
* **Refetch Button** (`data-testid="rq-refetch-btn"`): Triggers `refetch()`.

Wrap the tree with `QueryClientProvider` and fetch from a mock/public posts endpoint.
