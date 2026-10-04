import { useState } from "react";

export function App() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          data-testid={"star-" + n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setRating(n)}
          style={{ color: n <= shown ? "gold" : "#ccc", fontSize: 28, background: "none", border: "none" }}
        >
          ★
        </button>
      ))}
      <div data-testid="selected-rating">{rating}</div>
    </div>
  );
}
