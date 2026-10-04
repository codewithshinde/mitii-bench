'use client';

import { useMemo, useState } from "react";

const ROWS = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: "User " + (i + 1), email: "user" + (i + 1) + "@ex.com" }));

export default function Page() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ROWS.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div>
      <input data-testid="table-search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      <select data-testid="page-size-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
        {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead>
        <tbody>
          {slice.map((r) => <tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.email}</td></tr>)}
        </tbody>
      </table>
      <button data-testid="prev-page" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
      <span data-testid="page-indicator">Page {safePage} of {totalPages}</span>
      <button data-testid="next-page" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
