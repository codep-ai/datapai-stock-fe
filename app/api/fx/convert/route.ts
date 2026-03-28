/**
 * GET /api/fx/convert?amount=100&from=USD&to=CNY
 * Simple currency conversion endpoint.
 * Response: { amount: 100, from: "USD", to: "CNY", converted: 728.50, rate: 7.285 }
 */
import { NextRequest, NextResponse } from "next/server";
import { getLatestFxRateMap, convertPrice } from "@/lib/fx";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const amountStr = searchParams.get("amount");
  const from = searchParams.get("from")?.toUpperCase();
  const to = searchParams.get("to")?.toUpperCase();

  if (!amountStr || !from || !to) {
    return NextResponse.json(
      { error: "Required params: amount, from, to" },
      { status: 400 }
    );
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount)) {
    return NextResponse.json(
      { error: "amount must be a number" },
      { status: 400 }
    );
  }

  try {
    const rates = await getLatestFxRateMap();
    const converted = convertPrice(amount, from, to, rates);

    if (converted == null) {
      return NextResponse.json(
        { error: `Conversion not available for ${from} → ${to}` },
        { status: 404 }
      );
    }

    const fromRate = rates[from] ?? 1;
    const toRate = rates[to] ?? 1;
    const directRate = toRate / fromRate;

    return NextResponse.json({
      amount,
      from,
      to,
      converted: Math.round(converted * 100) / 100,
      rate: Math.round(directRate * 10000) / 10000,
    });
  } catch (err) {
    console.error("[fx/convert] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
