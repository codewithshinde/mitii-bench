import { useMemo, useState } from "react";

const IDS = ["a", "b", "c", "d"];

export function App() {
  const [checked, setChecked] = useState(() => Object.fromEntries(IDS.map((id) => [id, false])));
  const all = useMemo(() => IDS.every((id) => checked[id]), [checked]);

  const toggleAll = (val) => setChecked(Object.fromEntries(IDS.map((id) => [id, val])));

  return (
    <div>
      <label>
        <input
          data-testid="select-all-checkbox"
          type="checkbox"
          checked={all}
          onChange={(e) => toggleAll(e.target.checked)}
        />
        Select All
      </label>
      {IDS.map((id) => (
        <label key={id}>
          <input
            data-testid={"item-checkbox-" + id}
            type="checkbox"
            checked={checked[id]}
            onChange={(e) => setChecked((c) => ({ ...c, [id]: e.target.checked }))}
          />
          Item {id}
        </label>
      ))}
    </div>
  );
}
