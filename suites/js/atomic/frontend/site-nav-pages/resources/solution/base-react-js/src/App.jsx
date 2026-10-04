import { useState } from "react";

const PAGES = {
  home: {
    title: "Home",
    body: "Home page dummy content for BenchApp.",
  },
  about: {
    title: "About",
    body: "About page dummy content describing the company.",
  },
  careers: {
    title: "Careers",
    body: "Careers page dummy content with open roles.",
  },
  terms: {
    title: "Terms and Conditions",
    body: "Terms and Conditions page dummy legal text.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "Privacy Policy page dummy privacy text.",
  },
};

export function App() {
  const [page, setPage] = useState("home");
  const current = PAGES[page] ?? PAGES.home;

  return (
    <div className="app">
      <header className="header">
        <strong className="brand">BenchApp</strong>
        <nav data-testid="main-nav" className="nav">
          <a href="#home" onClick={(e) => { e.preventDefault(); setPage("home"); }}>
            Home
          </a>
          <a href="#about" onClick={(e) => { e.preventDefault(); setPage("about"); }}>
            About
          </a>
          <a href="#careers" onClick={(e) => { e.preventDefault(); setPage("careers"); }}>
            Careers
          </a>
        </nav>
      </header>
      <main data-testid="page-content">
        <h1>{current.title}</h1>
        <p>{current.body}</p>
      </main>
      <footer data-testid="site-footer" className="footer">
        <a href="#terms" onClick={(e) => { e.preventDefault(); setPage("terms"); }}>
          Terms and Conditions
        </a>
        <a href="#privacy" onClick={(e) => { e.preventDefault(); setPage("privacy"); }}>
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}
