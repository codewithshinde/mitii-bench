'use client';

import { useState } from "react";

const PATHS = {
  "/": ["Home"],
  "/products": ["Home", "Products"],
  "/products/electronics": ["Home", "Products", "Electronics"],
};

export default function Page() {
  const [path, setPath] = useState("/products/electronics");
  const crumbs = PATHS[path] || ["Home"];

  return (
    <div>
      <nav data-testid="breadcrumb-nav">
        {crumbs.map((c, i) => (
          <span key={c}>
            {i > 0 && " > "}
            <a href="#" onClick={(e) => { e.preventDefault(); setPath(i === 0 ? "/" : i === 1 ? "/products" : "/products/electronics"); }}>{c}</a>
          </span>
        ))}
      </nav>
      <div>
        <button onClick={() => setPath("/")}>Home</button>
        <button onClick={() => setPath("/products")}>Products</button>
        <button onClick={() => setPath("/products/electronics")}>Electronics</button>
      </div>
    </div>
  );
}
