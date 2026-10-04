import React, { lazy, Suspense, useState } from "react";

const Overview = lazy(() => import("./Overview.jsx"));
const Analytics = lazy(() => import("./Analytics.jsx"));

export function App() {
  const [tab, setTab] = useState("overview");

  return (
    <div>
      <button onClick={() => setTab("overview")}>Overview</button>
      <button onClick={() => setTab("analytics")}>Analytics</button>
      <Suspense
        fallback={
          <div data-testid="suspense-fallback">Loading module...</div>
        }
      >
        {tab === "overview" ? <Overview /> : <Analytics />}
      </Suspense>
    </div>
  );
}
