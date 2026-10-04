export function App() {
  return (
    <div>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          [data-testid="invoice-view"] { border: none; }
        }
      `}</style>
      <div data-testid="invoice-view" style={{ border: "1px solid #ccc", padding: 16 }}>
        <h1>Invoice #1001</h1>
        <p>Item A — $20</p>
        <p>Item B — $15</p>
        <p><strong>Total: $35</strong></p>
      </div>
      <button className="no-print" data-testid="print-btn" onClick={() => window.print()}>Print</button>
    </div>
  );
}
