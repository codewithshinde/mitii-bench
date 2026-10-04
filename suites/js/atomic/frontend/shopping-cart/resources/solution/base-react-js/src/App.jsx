import { useMemo, useState } from "react";

export function App() {
  const [items, setItems] = useState([
    { id: "a1", name: "Widget", price: 10, qty: 1 },
    { id: "b2", name: "Gadget", price: 25, qty: 2 },
  ]);

  const update = (id, delta) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it)));
  };

  const grand = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);

  return (
    <div>
      {items.map((it) => (
        <div key={it.id} data-testid={"cart-item-" + it.id}>
          <span>{it.name}</span>
          <button data-testid={"dec-" + it.id} onClick={() => update(it.id, -1)}>-</button>
          <span>{it.qty}</span>
          <button data-testid={"inc-" + it.id} onClick={() => update(it.id, 1)}>+</button>
          <span data-testid={"line-total-" + it.id}>{it.price * it.qty}</span>
        </div>
      ))}
      <div data-testid="grand-total">{grand}</div>
    </div>
  );
}
