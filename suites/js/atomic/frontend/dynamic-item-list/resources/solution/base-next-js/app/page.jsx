'use client';

import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  function addItem() {
    const trimmed = value.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setValue("");
  }

  return (
    <div>
      <input
        data-testid="item-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button data-testid="add-btn" onClick={addItem}>
        Add
      </button>
      <ul data-testid="item-list">
        {items.map((item, index) => (
          <li key={index} data-testid={`item-row-${index}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
