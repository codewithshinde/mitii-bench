import Link from "next/link";

export default function Nav() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link href="/" data-testid="link-home">
        Home
      </Link>
      <Link href="/dashboard" data-testid="link-dashboard">
        Dashboard
      </Link>
    </nav>
  );
}
