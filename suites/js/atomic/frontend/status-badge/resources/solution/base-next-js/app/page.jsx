'use client';

import { useState } from "react";

export default function Page() {
  const [online, setOnline] = useState(true);

  return (
    <div data-testid="status-container">
      <button
        data-testid="status-toggle-btn"
        onClick={() => setOnline((v) => !v)}
      >
        Toggle
      </button>
      <span
        data-testid="status-badge"
        style={{
          background: online ? "green" : "gray",
          color: "#fff",
          padding: "4px 8px",
        }}
      >
        {online ? "Online" : "Offline"}
      </span>
    </div>
  );
}
