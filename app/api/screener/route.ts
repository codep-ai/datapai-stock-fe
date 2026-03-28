/**
 * GET /api/screener?exchange=US&signal=BUY&sector=Technology&min_score=0.2&limit=50
 * Proxy to Python backend: GET /agent/fundamental-screener
 */

import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

const AGENT_BASE = (process.env.AGENT_BACKEND_BASE_URL ?? "").replace(/\/$/, "");

export async function GET(req: NextRequest) {
  if (!AGENT_BASE) {
    return NextResponse.json({ ok: false, error: "AGENT_BACKEND_BASE_URL not configured" }, { status: 503 });
  }

  const qs = req.nextUrl.searchParams.toString();
  const exchange = req.nextUrl.searchParams.get("exchange") ?? "US";

  try {
    const res = await fetch(
      `${AGENT_BASE}/agent/fundamental-screener${qs ? `?${qs}` : ""}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });

    const rows = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.items)
        ? json.data.items
        : [];

    // Enrich with latest prices
    if (rows.length > 0) {
      const tickers = rows.map((r: any) => r.ticker ?? r.symbol).filter(Boolean);
      if (tickers.length > 0) {
        const priceRes = await getPool().query(`
          SELECT DISTINCT ON (ticker) ticker, close AS price,
            CASE WHEN prev.close > 0 THEN ROUND(((p.close - prev.close) / prev.close * 100)::numeric, 2) ELSE NULL END AS change_1d_pct
          FROM datapai.prices p
          LEFT JOIN LATERAL (
            SELECT close FROM datapai.prices
            WHERE ticker = p.ticker AND exchange = p.exchange AND trade_date < p.trade_date
            ORDER BY trade_date DESC LIMIT 1
          ) prev ON true
          WHERE p.ticker = ANY($1) AND p.exchange = $2
          ORDER BY ticker, p.trade_date DESC
        `, [tickers, exchange]);

        const priceMap: Record<string, { price: number; change_1d_pct: number | null }> = {};
        for (const r of priceRes.rows) {
          priceMap[r.ticker] = { price: Number(r.price), change_1d_pct: r.change_1d_pct != null ? Number(r.change_1d_pct) : null };
        }

        for (const row of rows) {
          const tk = row.ticker ?? row.symbol;
          if (priceMap[tk]) {
            row.price = priceMap[tk].price;
            row.change_1d_pct = priceMap[tk].change_1d_pct;
          }
        }
      }
    }

    return NextResponse.json({ ok: json.ok ?? true, data: rows });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}
