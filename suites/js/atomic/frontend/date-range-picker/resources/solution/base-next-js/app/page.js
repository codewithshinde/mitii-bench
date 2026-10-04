'use client';

import { useMemo, useState } from "react";

export default function Page() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const error = useMemo(() => start && end && end < start, [start, end]);

  return (
    <div>
      <input data-testid="start-date" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
      <input data-testid="end-date" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
      {error && <p data-testid="date-error">End Date cannot be prior to Start Date</p>}
    </div>
  );
}
