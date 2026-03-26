import { NextResponse } from "next/server";
import { getIntradayBars } from "@/lib/db";

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
    const data = await getIntradayBars(sym, exchange, days);
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, data: [], error: String(e) }, { status: 500 });
  }
}
