'use client';

import { useRef, useState } from "react";

export default function Page() {
  const [leftPct, setLeftPct] = useState(40);
  const box = useRef(null);

  const onMouseDown = (e) => {
    e.preventDefault();
    const onMove = (ev) => {
      const rect = box.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.min(80, Math.max(20, pct)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div ref={box} style={{ display: "flex", height: 200, border: "1px solid #ccc" }}>
      <div data-testid="left-panel" style={{ width: leftPct + "%", overflow: "auto", padding: 8 }}>Left</div>
      <div
        data-testid="resize-handle"
        onMouseDown={onMouseDown}
        style={{ width: 6, cursor: "col-resize", background: "#bbb" }}
      />
      <div data-testid="right-panel" style={{ width: 100 - leftPct + "%", overflow: "auto", padding: 8 }}>Right</div>
    </div>
  );
}
