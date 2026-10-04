'use client';

import { useMemo, useState } from "react";

const OPTIONS = ["React", "Vue", "Angular", "Svelte", "Solid"];

export default function Page() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState("");
  const filtered = useMemo(
    () => OPTIONS.filter((o) => o.toLowerCase().includes(filter.toLowerCase())),
    [filter]
  );

  return (
    <div>
      <button data-testid="custom-select-trigger" onClick={() => setOpen((o) => !o)}>
        {value || "Select..."}
      </button>
      {open && (
        <div>
          <input data-testid="custom-select-search" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <ul data-testid="custom-select-options">
            {filtered.map((o) => (
              <li key={o} onClick={() => { setValue(o); setOpen(false); setFilter(""); }}>{o}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
