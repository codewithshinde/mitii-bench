import { useState } from "react";

export function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24 }}>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
          <button data-testid="fab-child-1">Action 1</button>
          <button data-testid="fab-child-2">Action 2</button>
          <button data-testid="fab-child-3">Action 3</button>
        </div>
      )}
      <button data-testid="fab-main" onClick={() => setOpen((o) => !o)} style={{ borderRadius: "50%", width: 56, height: 56 }}>
        {open ? "×" : "+"}
      </button>
    </div>
  );
}
