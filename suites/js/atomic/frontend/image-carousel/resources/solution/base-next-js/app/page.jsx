'use client';

import { useState } from "react";

const IMAGES = [
  "https://via.placeholder.com/400x200?text=Slide+1",
  "https://via.placeholder.com/400x200?text=Slide+2",
  "https://via.placeholder.com/400x200?text=Slide+3",
];

export default function Page() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? IMAGES.length - 1 : i - 1));
  const next = () => setIndex((i) => (i + 1) % IMAGES.length);

  return (
    <div>
      <img data-testid="carousel-image" src={IMAGES[index]} alt={"Slide " + (index + 1)} />
      <button data-testid="carousel-prev" onClick={prev}>Prev</button>
      <button data-testid="carousel-next" onClick={next}>Next</button>
      <div>
        {IMAGES.map((_, i) => (
          <button
            key={i}
            data-testid={"carousel-dot-" + i}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            style={{ fontWeight: i === index ? "bold" : "normal" }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
