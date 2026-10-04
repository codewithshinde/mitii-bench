import { useState } from "react";

export function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button data-testid="open-cart-btn" onClick={() => setOpen(true)}>Open Cart</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)" }} />
          <aside
            data-testid="cart-drawer"
            style={{ position: "fixed", top: 0, right: 0, width: 280, height: "100%", background: "#fff", padding: 16, boxShadow: "-2px 0 8px rgba(0,0,0,.2)" }}
          >
            <h2>Cart</h2>
            <p>Your cart is empty.</p>
            <button data-testid="close-cart-btn" onClick={() => setOpen(false)}>Close</button>
          </aside>
        </>
      )}
    </div>
  );
}
