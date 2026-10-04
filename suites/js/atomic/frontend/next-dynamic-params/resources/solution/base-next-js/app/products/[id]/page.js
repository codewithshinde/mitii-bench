"use client";

import { useParams } from "next/navigation";

// App Router dynamic segment: /products/[id]
export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div data-testid="product-detail">Product Details for ID: {id}</div>
  );
}
