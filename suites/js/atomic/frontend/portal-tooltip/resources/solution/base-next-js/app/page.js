'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  return (
    <div>
      <button
        data-testid="tooltip-target"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        Hover me
      </button>
      {open &&
        modalRoot &&
        createPortal(
          <div data-testid="portal-tooltip">Tooltip content</div>,
          modalRoot
        )}
    </div>
  );
}
