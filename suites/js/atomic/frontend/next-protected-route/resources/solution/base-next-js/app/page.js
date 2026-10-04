import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function ProtectedPage() {
  const isAuthenticated = cookies().get("auth")?.value === "1";
  if (!isAuthenticated) {
    redirect("/login");
  }

  return <div data-testid="protected-view">Protected Content</div>;
}
