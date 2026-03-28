/**
 * GET /api/markets
 * Returns all 4 sections of the Markets Overview page in a single call:
 *   indexes  — proxied from Python backend /agent/index-overview
 *   fx       — from datapai.fx_rates_daily (latest + prev day for change%)
 *   commodities — from datapai.commodity_prices (latest 2 days)
 *   crypto   — from datapai.crypto_prices (latest 2 days)
 */
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

const AGENT_BASE = process.env.AGENT_BASE_URL ?? "http://localhost:8005";

/* ── helper: query latest 2 days from an OHLCV table ── */
async function latestTwoDays(table: string) {
  const pool = getPool();
  const { rows } = await pool.query(`
    WITH ranked AS (
      SELECT ticker, trade_date, open, high, low, close, volume,
             DENSE_RANK() OVER (ORDER BY trade_date DESC) AS dr
      FROM datapai.${table}
    )
    SELECT ticker, trade_date, open, high, low, close, volume, dr
    FROM ranked WHERE dr <= 2
    ORDER BY ticker, trade_date DESC
  `);
  return rows;
}

/* ── helper: pair latest + prev day rows into change% ── */
function pairRows(rows: Record<string, unknown>[]) {
  const byTicker: Record<string, Record<string, unknown>[]> = {};
  for (const r of rows) {
    const t = r.ticker as string;
    if (!byTicker[t]) byTicker[t] = [];
    byTicker[t].push(r);
  }
  return Object.entries(byTicker).map(([ticker, arr]) => {
    const latest = arr[0];
    const prev = arr.length > 1 ? arr[1] : null;
    const close = Number(latest.close);
    const prevClose = prev ? Number(prev.close) : null;
    const changePct = prevClose && prevClose !== 0
      ? ((close - prevClose) / prevClose) * 100
      : null;
    return {
      ticker,
      trade_date: latest.trade_date,
      close,
      open: Number(latest.open),
      high: Number(latest.high),
      low: Number(latest.low),
      volume: latest.volume,
      prev_close: prevClose,
      change_pct: changePct !== null ? Math.round(changePct * 100) / 100 : null,
    };
  });
}

export async function GET() {
  try {
    const pool = getPool();

    // Run all 4 queries in parallel
    const [indexRes, fxRows, commodityRows, cryptoRows] = await Promise.all([
      // 1. Indexes — proxy to Python backend
      fetch(`${AGENT_BASE}/agent/index-overview`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      })
        .then((r) => r.json())
        .then((j) => j.data ?? [])
        .catch(() => []),

      // 2. FX rates — latest 2 days
      pool.query(`
        WITH dates AS (
          SELECT DISTINCT trade_date
          FROM datapai.fx_rates_daily
          ORDER BY trade_date DESC
          LIMIT 2
        )
        SELECT f.quote_currency, f.rate, f.trade_date
        FROM datapai.fx_rates_daily f
        JOIN dates d ON f.trade_date = d.trade_date
        WHERE f.base_currency = 'USD'
        ORDER BY f.quote_currency, f.trade_date DESC
      `).then((r) => r.rows),

      // 3. Commodities
      latestTwoDays("commodity_prices"),

      // 4. Crypto
      latestTwoDays("crypto_prices"),
    ]);

    // Process FX into paired change%
    const fxByQuote: Record<string, Record<string, unknown>[]> = {};
    for (const r of fxRows) {
      const q = r.quote_currency as string;
      if (!fxByQuote[q]) fxByQuote[q] = [];
      fxByQuote[q].push(r);
    }
    const fx = Object.entries(fxByQuote).map(([quote, arr]) => {
      const latest = arr[0];
      const prev = arr.length > 1 ? arr[1] : null;
      const rate = Number(latest.rate);
      const prevRate = prev ? Number(prev.rate) : null;
      const changePct = prevRate && prevRate !== 0
        ? ((rate - prevRate) / prevRate) * 100
        : null;
      return {
        quote_currency: quote,
        rate,
        trade_date: latest.trade_date,
        prev_rate: prevRate,
        change_pct: changePct !== null ? Math.round(changePct * 100) / 100 : null,
      };
    });

    return NextResponse.json({
      ok: true,
      indexes: indexRes,
      fx,
      commodities: pairRows(commodityRows),
      crypto: pairRows(cryptoRows),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
