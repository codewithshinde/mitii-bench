export function App() {
  return (
    <div className="app">
      <header className="header">
        <strong className="brand">BenchApp</strong>
        <nav data-testid="main-nav" className="nav">
          {/* Cases add top-nav links here */}
        </nav>
      </header>
      <main data-testid="page-content">
        <h1>Welcome</h1>
        <p>Small UI fixture for mitii-bench cases.</p>
      </main>
      <footer data-testid="site-footer" className="footer">
        {/* Cases add footer links here */}
      </footer>
    </div>
  );
}
