"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  function handleLogin() {
    document.cookie = "auth=1; path=/";
    router.push("/");
    router.refresh();
  }

  return (
    <div data-testid="login-view">
      <h1>Login</h1>
      <button type="button" onClick={handleLogin}>
        Sign in
      </button>
    </div>
  );
}
