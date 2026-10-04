import { useEffect, useState } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  return (
    <div>
      <input
        data-testid="debounced-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <span data-testid="debounced-value">{debouncedQuery}</span>
    </div>
  );
}
