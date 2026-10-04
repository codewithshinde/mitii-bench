export default function HomePage() {
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <strong>BenchApp</strong>
        <nav data-testid="main-nav" style={{ display: "flex", gap: "1rem" }}>
          {/* Cases add top-nav links here */}
        </nav>
      </header>
      <main data-testid="page-content" style={{ padding: "2rem 1.5rem" }}>
        <h1>Welcome</h1>
        <p>Next.js App Router base for mitii-bench.</p>
      </main>
      <footer
        data-testid="site-footer"
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem 1.5rem",
          borderTop: "1px solid #ddd",
        }}
      >
        {/* Cases add footer links here */}
      </footer>
    </div>
  );
}
