'use client';

import { useState } from "react";

function SuccessIcon() {
  return (
    <svg width="24" height="24" aria-label="success">
      <circle cx="12" cy="12" r="10" fill="green" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="24" height="24" aria-label="warning">
      <polygon points="12,2 22,22 2,22" fill="orange" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="24" height="24" aria-label="error">
      <rect x="4" y="4" width="16" height="16" fill="red" />
    </svg>
  );
}

const ICONS = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

function StatusIcon({ type }) {
  const Icon = ICONS[type] || SuccessIcon;
  return (
    <div data-testid="status-icon">
      <Icon />
    </div>
  );
}

export default function Page() {
  const [type, setType] = useState("success");

  return (
    <div>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="success">success</option>
        <option value="warning">warning</option>
        <option value="error">error</option>
      </select>
      <StatusIcon type={type} />
    </div>
  );
}
