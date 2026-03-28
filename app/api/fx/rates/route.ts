/**
 * GET /api/fx/rates — returns latest FX rates for all currencies
 * Response: { rates: { USD: 1, AUD: 1.52, HKD: 7.82, ... }, updated: "2026-03-28" }
 */
import { NextResponse } from "next/server";
import { getLatestFxRates } from "@/lib/fx";

export const dynamic = "force-dynamic";

// Cache for 5 minutes (rates don't change intraday)
export const revalidate = 300;

export async function GET() {
  try {
    const fxRates = await getLatestFxRates();

    if (fxRates.length === 0) {
      return NextResponse.json({ rates: { USD: 1 }, updated: null });
    }

    const rates: Record<string, number> = { USD: 1.0 };
    let latestDate = "";

    for (const r of fxRates) {
      rates[r.quote_currency] = r.rate;
      if (r.trade_date > latestDate) latestDate = r.trade_date;
    }

    return NextResponse.json({ rates, updated: latestDate });
  } catch (err) {
    console.error("[fx/rates] Error:", err);
    // Return USD-only fallback so frontend doesn't break
    return NextResponse.json({ rates: { USD: 1 }, updated: null });
  }
}
