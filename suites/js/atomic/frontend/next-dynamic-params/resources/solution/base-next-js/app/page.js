import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Products</h1>
      <Link href="/products/42">View product 42</Link>
    </div>
  );
}
