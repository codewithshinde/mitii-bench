export function SiteChrome({ children }) {
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
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/careers">Careers</a>
        </nav>
      </header>
      <main data-testid="page-content" style={{ padding: "2rem 1.5rem" }}>
        {children}
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
        <a href="/terms">Terms and Conditions</a>
        <a href="/privacy">Privacy Policy</a>
      </footer>
    </div>
  );
}
