'use client';

import { useRef } from "react";

export default function Page() {
  const inputRef = useRef(null);

  return (
    <div>
      <input data-testid="search-input" ref={inputRef} type="search" />
      <button
        data-testid="focus-btn"
        onClick={() => inputRef.current?.focus()}
      >
        Focus
      </button>
    </div>
  );
}
