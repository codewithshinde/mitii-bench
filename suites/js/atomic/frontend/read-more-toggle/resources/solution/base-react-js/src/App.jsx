import { useState } from "react";

const FULL =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

export function App() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? FULL : FULL.slice(0, 100) + (FULL.length > 100 ? "…" : "");

  return (
    <div>
      <p data-testid="text-block">{shown}</p>
      <button data-testid="toggle-read-more" onClick={() => setExpanded((e) => !e)}>
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}
