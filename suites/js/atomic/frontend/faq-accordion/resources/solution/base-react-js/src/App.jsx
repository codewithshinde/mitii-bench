import { useState } from "react";

const ITEMS = [
  { id: "1", q: "What is this?", a: "An FAQ accordion." },
  { id: "2", q: "How does it work?", a: "Only one panel opens at a time." },
  { id: "3", q: "Can I close it?", a: "Click the open header again to close." },
];

export function App() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {ITEMS.map((item) => (
        <div key={item.id}>
          <button
            data-testid={"accordion-header-" + item.id}
            onClick={() => setOpen((o) => (o === item.id ? null : item.id))}
          >
            {item.q}
          </button>
          {open === item.id && (
            <div data-testid={"accordion-panel-" + item.id}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
