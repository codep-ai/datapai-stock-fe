"use client";

export default function LogoutButton() {
  async function handleLogout() {
    // Clear BOTH the SSO JWT (apex .datap.ai cookie via the auth subdomain)
    // AND the local stock-fe session cookie. Doing only SSO previously left
    // users still authenticated by the legacy session cookie (and vice-versa),
    // so the header email kept showing after "Sign out".
    await Promise.allSettled([
      fetch("https://auth.datap.ai/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }),
      fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }),
    ]);
    // Hard navigation so SSR re-evaluates auth and React state clears.
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
      style={{ padding: "0.5rem 0.75rem" }}
    >
      Sign out
    </button>
  );
}
