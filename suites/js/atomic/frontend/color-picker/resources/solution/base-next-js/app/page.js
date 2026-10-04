'use client';

import { useState } from "react";

const SWATCHES = ["#ff0000", "#00aa00", "#0066ff", "#ffaa00", "#8800ff"];

export default function Page() {
  const [color, setColor] = useState("#ff0000");

  return (
    <div>
      {SWATCHES.map((c) => (
        <button
          key={c}
          data-testid={"swatch-" + c}
          onClick={() => setColor(c)}
          style={{ background: c, width: 28, height: 28, marginRight: 4, border: color === c ? "2px solid #000" : "1px solid #ccc" }}
        />
      ))}
      <input data-testid="hex-input" value={color} onChange={(e) => setColor(e.target.value)} />
      <div data-testid="color-preview" style={{ width: 80, height: 80, background: color, marginTop: 8 }} />
    </div>
  );
}
