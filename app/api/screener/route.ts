/**
 * GET /api/screener?exchange=US&signal=BUY&sector=Technology&min_score=0.2&limit=50
 * Proxy to Python backend: GET /agent/fundamental-screener
 */

import { NextRequest, NextResponse } from "next/server";

const AGENT_BASE = (process.env.AGENT_BACKEND_BASE_URL ?? "").replace(/\/$/, "");

export async function GET(req: NextRequest) {
  if (!AGENT_BASE) {
    return NextResponse.json({ ok: false, error: "AGENT_BACKEND_BASE_URL not configured" }, { status: 503 });
  }

  // Forward all query params directly to the Python backend
  const qs = req.nextUrl.searchParams.toString();

  try {
    const res = await fetch(
      `${AGENT_BASE}/agent/fundamental-screener${qs ? `?${qs}` : ""}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });

    // Normalise: Python backend returns { ok, data: { items: [...] } } or { ok, data: [...] }
    const rows = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.items)
        ? json.data.items
        : [];
    return NextResponse.json({ ok: json.ok ?? true, data: rows });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}
