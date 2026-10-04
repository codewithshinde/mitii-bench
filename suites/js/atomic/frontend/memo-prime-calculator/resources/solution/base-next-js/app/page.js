'use client';

import { useMemo, useState } from "react";

function isPrime(n) {
  const num = Number(n);
  if (!Number.isInteger(num) || num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

export default function Page() {
  const [value, setValue] = useState("2");
  const [tick, setTick] = useState(0);

  const primeResult = useMemo(() => {
    return isPrime(value) ? "prime" : "not prime";
  }, [value]);

  return (
    <div>
      <input
        data-testid="number-input"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span data-testid="prime-result">{primeResult}</span>
      <button onClick={() => setTick((t) => t + 1)}>Rerender {tick}</button>
    </div>
  );
}
