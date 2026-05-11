import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/db";
import { SESSION_COOKIE, SSO_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Sign out: clear BOTH the legacy session-cookie auth AND the SSO JWT cookie.
 *
 * The earlier version only cleared SESSION_COOKIE, which silently left users
 * still authenticated via the SSO JWT (`datapai_auth`). Symptom: clicked
 * "Sign out" → email kept showing in the header. Now we clear both.
 *
 * We also clear the cookie at multiple `domain` scopes because the JWT may be
 * issued at the apex (`.datap.ai`) for SSO sharing across subdomains while
 * sometimes also set at the bare host (`stock.datap.ai`). Hitting both ensures
 * the browser drops it regardless of how it was originally set.
 */
export async function POST() {
  const cookieStore = await cookies();

  // 1) Legacy session cookie + DB-side session row
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    try { await deleteSession(token); } catch { /* best-effort */ }
  }
  cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });

  // 2) SSO JWT cookie — clear at host scope AND apex scope so it dies whichever
  //    domain it was originally set with. set() with maxAge=0 expires immediately.
  cookieStore.set(SSO_COOKIE, "", { maxAge: 0, path: "/" });
  cookieStore.set(SSO_COOKIE, "", { maxAge: 0, path: "/", domain: ".datap.ai" });

  return NextResponse.json({ success: true });
}
