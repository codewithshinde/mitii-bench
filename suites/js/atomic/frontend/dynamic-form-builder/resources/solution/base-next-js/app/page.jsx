'use client';

import { useState } from "react";

export default function Page() {
  const [fields, setFields] = useState([{ label: "", type: "Text" }]);

  const update = (i, patch) => setFields((f) => f.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  return (
    <div>
      <button data-testid="add-field-btn" onClick={() => setFields((f) => [...f, { label: "", type: "Text" }])}>
        Add Field
      </button>
      {fields.map((field, i) => (
        <div key={i} data-testid={"custom-field-" + i} style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input placeholder="Label" value={field.label} onChange={(e) => update(i, { label: e.target.value })} />
          <select value={field.type} onChange={(e) => update(i, { type: e.target.value })}>
            <option>Text</option>
            <option>Number</option>
          </select>
          <button onClick={() => setFields((f) => f.filter((_, idx) => idx !== i))}>Remove</button>
        </div>
      ))}
    </div>
  );
}
