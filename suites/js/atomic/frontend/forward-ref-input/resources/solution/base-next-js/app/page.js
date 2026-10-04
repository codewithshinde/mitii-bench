'use client';

import { forwardRef, useRef } from "react";

const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input data-testid="fancy-input" ref={ref} {...props} />;
});

export default function Page() {
  const inputRef = useRef(null);

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button
        data-testid="parent-focus-btn"
        onClick={() => inputRef.current?.focus()}
      >
        Focus input
      </button>
    </div>
  );
}
