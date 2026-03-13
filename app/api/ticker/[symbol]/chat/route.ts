/**
 * POST /api/ticker/[symbol]/chat
 *
 * Proxies to Python /agent/stock-chat.
 * Passes: ticker, exchange, message, conversation history,
 *         user_id, lang, ta_signal_md (if cached), snapshot_text.
 *
 * This is the gateway between the Next.js chat UI and the
 * datapai-streamlit stock_chat module.
 */

import { NextResponse } from "next/server";
import { UNIVERSE_ALL } from "@/lib/universe";
import { getAuthUser } from "@/lib/auth";

export const dynamic    = "force-dynamic";
export const maxDuration = 60;

const AGENT_BASE = (process.env.AGENT_BACKEND_BASE_URL ?? "").replace(/\/$/, "");

export async function POST(
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();

  if (!AGENT_BASE) {
    return NextResponse.json(
      { ok: false, error: "Agent backend not configured" },
      { status: 503 }
    );
  }

  let body: {
    message?: string;
    session_id?: string;
    new_session?: boolean;
    lang?: string;
    ta_signal_md?: string;
    snapshot_text?: string;
  } = {};
  try { body = await req.json(); } catch { /* ok */ }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ ok: false, error: "message is required" }, { status: 400 });
  }

  // Resolve exchange for this ticker
  const tickerInfo = UNIVERSE_ALL.find((t) => t.symbol === symbol);
  const exchange   = tickerInfo?.exchange ?? "US";

  // Get authenticated user ID (fallback 0 for anonymous)
  let userId = 0;
  try {
    const user = await getAuthUser();
    if (user?.userId) userId = parseInt(user.userId, 10) || 0;
  } catch { /* anonymous */ }

  try {
    const res = await fetch(`${AGENT_BASE}/agent/stock-chat`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        ticker:       symbol,
        exchange,
        message,
        user_id:      userId,
        session_id:   body.session_id ?? null,
        new_session:  body.new_session ?? false,
        lang:         body.lang ?? "en",
        ta_signal_md: body.ta_signal_md ?? null,
        snapshot_text:body.snapshot_text ?? null,
      }),
      signal: AbortSignal.timeout(55_000),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data?.detail ?? `Agent returned ${res.status}` },
        { status: 502 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
