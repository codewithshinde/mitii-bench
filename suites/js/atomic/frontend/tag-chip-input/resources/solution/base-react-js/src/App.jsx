import { useState } from "react";

export function App() {
  const [value, setValue] = useState("");
  const [chips, setChips] = useState([]);

  const add = (raw) => {
    const t = raw.trim().replace(/,$/, "");
    if (!t || chips.includes(t)) return;
    setChips((c) => [...c, t]);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(value);
    }
  };

  return (
    <div>
      <div>
        {chips.map((c) => (
          <span key={c} data-testid={"chip-" + c} style={{ marginRight: 6, border: "1px solid #999", padding: "2px 6px" }}>
            {c}
            <button onClick={() => setChips((list) => list.filter((x) => x !== c))}>X</button>
          </span>
        ))}
      </div>
      <input data-testid="chip-input" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} />
    </div>
  );
}
