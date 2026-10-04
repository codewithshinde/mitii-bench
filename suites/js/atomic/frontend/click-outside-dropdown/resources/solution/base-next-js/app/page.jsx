'use client';

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [open, setOpen] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <div data-testid="dropdown-menu" ref={menuRef}>
          Menu item
        </div>
      )}
    </div>
  );
}
