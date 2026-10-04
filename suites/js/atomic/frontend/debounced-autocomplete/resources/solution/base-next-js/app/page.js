'use client';

import { useEffect, useMemo, useState } from "react";

const DB = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Grape", "Mango", "Orange", "Peach", "Pear"];

export default function Page() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(-1);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const suggestions = useMemo(() => {
    if (!debounced.trim()) return [];
    return DB.filter((x) => x.toLowerCase().includes(debounced.toLowerCase()));
  }, [debounced]);

  const onKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      setSelected(suggestions[active]);
      setQuery(suggestions[active]);
      setActive(-1);
    }
  };

  return (
    <div>
      <input data-testid="search-input" value={query} onChange={(e) => { setQuery(e.target.value); setActive(-1); }} onKeyDown={onKeyDown} />
      {suggestions.length > 0 && (
        <ul data-testid="search-suggestions">
          {suggestions.map((s, i) => (
            <li key={s} style={{ background: i === active ? "#def" : "transparent" }} onMouseDown={() => { setSelected(s); setQuery(s); }}>
              {s}
            </li>
          ))}
        </ul>
      )}
      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}
