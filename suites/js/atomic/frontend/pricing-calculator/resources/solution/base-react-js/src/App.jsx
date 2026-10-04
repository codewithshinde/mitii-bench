import { useMemo, useState } from "react";

const PER_USER = 10;

export function App() {
  const [users, setUsers] = useState(10);
  const [yearly, setYearly] = useState(false);

  const price = useMemo(() => {
    const monthly = users * PER_USER;
    return yearly ? Math.round(monthly * 12 * 0.8) : monthly;
  }, [users, yearly]);

  return (
    <div>
      <label>
        Users
        <input
          data-testid="user-slider"
          type="range"
          min={1}
          max={100}
          value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
        />
        {users}
      </label>
      <label>
        <input
          data-testid="billing-toggle"
          type="checkbox"
          checked={yearly}
          onChange={(e) => setYearly(e.target.checked)}
        />
        {yearly ? "Yearly" : "Monthly"} (20% discount yearly)
      </label>
      <div data-testid="calculated-price">${price}</div>
    </div>
  );
}
