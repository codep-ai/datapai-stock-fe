/**
 * GET /api/ticker/[symbol]/fundamentals?exchange=US
 * Proxy to Python backend: GET /agent/fundamental-snapshot
 */

import { NextRequest, NextResponse } from "next/server";

const AGENT_BASE = (process.env.AGENT_BACKEND_BASE_URL ?? "").replace(/\/$/, "");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const exchange = req.nextUrl.searchParams.get("exchange") ?? "US";

  if (!AGENT_BASE) {
    return NextResponse.json({ ok: false, error: "AGENT_BACKEND_BASE_URL not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `${AGENT_BASE}/agent/fundamental-snapshot?ticker=${encodeURIComponent(symbol.toUpperCase())}&exchange=${encodeURIComponent(exchange.toUpperCase())}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    return NextResponse.json(json, { status: res.ok ? 200 : res.status });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}
