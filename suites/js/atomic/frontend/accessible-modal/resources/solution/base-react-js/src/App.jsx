import { useEffect, useRef, useState } from "react";

export function App() {
  const [open, setOpen] = useState(false);
  const firstRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const focusables = [firstRef.current, lastRef.current].filter(Boolean);
        if (!focusables.length) return;
        if (e.shiftKey && document.activeElement === firstRef.current) {
          e.preventDefault();
          lastRef.current.focus();
        } else if (!e.shiftKey && document.activeElement === lastRef.current) {
          e.preventDefault();
          firstRef.current.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {open && (
        <div data-testid="accessible-modal" role="dialog" aria-modal="true">
          <h2>Accessible Modal</h2>
          <button ref={firstRef} onClick={() => {}}>Action</button>
          <button ref={lastRef} onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
