'use client';

import { useRef, useState } from "react";

const SRC = "https://via.placeholder.com/300";

export default function Page() {
  const imgRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50, show: false });

  const onMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y, show: true });
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <img
        ref={imgRef}
        data-testid="product-image"
        src={SRC}
        alt="Product"
        onMouseMove={onMove}
        onMouseLeave={() => setPos((p) => ({ ...p, show: false }))}
        width={300}
        height={300}
      />
      {pos.show && (
        <div
          data-testid="zoom-preview"
          style={{
            width: 200,
            height: 200,
            backgroundImage: "url(" + SRC + ")",
            backgroundSize: "200%",
            backgroundPosition: pos.x + "% " + pos.y + "%",
            border: "1px solid #ccc",
          }}
        />
      )}
    </div>
  );
}
