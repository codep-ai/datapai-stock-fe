import { NextResponse } from "next/server";
import { getIntradayBars } from "@/lib/db";
import { fetchAndCacheIntraday } from "@/lib/intradayOnDemand";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const sym = decodeURIComponent(symbol).toUpperCase();
  const url = new URL(_req.url);
  const days = Math.min(parseInt(url.searchParams.get("days") || "2", 10), 60);
  const exchange = (url.searchParams.get("exchange") || "US").toUpperCase();

  try {
    // 1. Check if we already have today's intraday data
    let data = await getIntradayBars(sym, exchange, days);

    // 2. If no data for this ticker, fetch on-demand from Yahoo and cache
    if (data.length === 0) {
      data = await fetchAndCacheIntraday(sym, exchange);
    }

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, data: [], error: String(e) }, { status: 500 });
  }
}
