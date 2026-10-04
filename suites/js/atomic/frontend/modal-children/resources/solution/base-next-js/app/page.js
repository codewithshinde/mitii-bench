'use client';

import { useState } from "react";

function Modal({ title, onClose, children }) {
  return (
    <div data-testid="modal-wrapper">
      <h2 data-testid="modal-title">{title}</h2>
      <div data-testid="modal-body">{children}</div>
      <button data-testid="modal-close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default function Page() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <Modal title="Hello" onClose={() => setOpen(false)}>
          <p>Modal body content</p>
        </Modal>
      )}
    </div>
  );
}
