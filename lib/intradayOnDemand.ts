/**
 * lib/intradayOnDemand.ts — On-demand intraday data fetch for non-watchlist stocks.
 *
 * When a user views a ticker page for a stock not in demo/watchlist,
 * we fetch 1-day 5m bars from Yahoo Finance, cache them in the
 * per-market intraday table, and return them immediately.
 *
 * Next viewer of the same stock gets cached data (no Yahoo call).
 * The intraday archive process cleans up old data automatically.
 */

import { getPool, type IntradayBar } from "./db";

// Exchange → Yahoo suffix
const YF_SUFFIX: Record<string, string> = {
  ASX: ".AX", HKEX: ".HK", HOSE: ".VN", SET: ".BK",
  KLSE: ".KL", IDX: ".JK", LSE: ".L", SSE: ".SS", SZSE: ".SZ",
};

// Exchange → per-market intraday table
const INTRADAY_TABLE: Record<string, string> = {
  US: "ohlcv_intraday_us", ASX: "ohlcv_intraday_asx",
  HKEX: "ohlcv_intraday_hkex", HOSE: "ohlcv_intraday_hose",
  SET: "ohlcv_intraday_set", KLSE: "ohlcv_intraday_klse",
  IDX: "ohlcv_intraday_idx", SSE: "ohlcv_intraday_sse",
  SZSE: "ohlcv_intraday_szse", LSE: "ohlcv_intraday_lse",
};

// Market timezone for converting UTC → local timestamps
const MARKET_TZ: Record<string, string> = {
  US: "America/New_York", ASX: "Australia/Sydney",
  HKEX: "Asia/Hong_Kong", HOSE: "Asia/Ho_Chi_Minh",
  SET: "Asia/Bangkok", KLSE: "Asia/Kuala_Lumpur",
  IDX: "Asia/Jakarta", SSE: "Asia/Shanghai",
  SZSE: "Asia/Shanghai", LSE: "Europe/London",
};

// In-memory lock to prevent concurrent fetches for the same ticker
const fetchingSet = new Set<string>();

/**
 * Fetch intraday bars from Yahoo Finance for a single ticker,
 * cache into the per-market intraday table, and return the bars.
 */
export async function fetchAndCacheIntraday(
  ticker: string,
  exchange: string
): Promise<IntradayBar[]> {
  const key = `${exchange}:${ticker}`;

  // Prevent duplicate concurrent fetches
  if (fetchingSet.has(key)) {
    // Another request is already fetching — wait briefly and read from DB
    await new Promise((r) => setTimeout(r, 2000));
    return readFromDB(ticker, exchange);
  }

  fetchingSet.add(key);
  try {
    const suffix = YF_SUFFIX[exchange] ?? "";
    const yfSymbol = `${ticker}${suffix}`;
    const tz = MARKET_TZ[exchange] ?? "UTC";

    // Fetch from Yahoo Finance v8 chart API (1d of 5m bars)
    const now = Math.floor(Date.now() / 1000);
    const from = now - 2 * 24 * 60 * 60; // 2 days to cover weekends
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yfSymbol)}` +
      `?period1=${from}&period2=${now}&interval=5m&includePrePost=false`;

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[intraday-on-demand] Yahoo ${res.status} for ${yfSymbol}`);
      return [];
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return [];

    const timestamps: number[] = result.timestamp ?? [];
    const quote = result.indicators?.quote?.[0] ?? {};
    const opens: number[] = quote.open ?? [];
    const highs: number[] = quote.high ?? [];
    const lows: number[] = quote.low ?? [];
    const closes: number[] = quote.close ?? [];
    const volumes: number[] = quote.volume ?? [];

    if (timestamps.length === 0) return [];

    // Convert to local market time and build rows
    const bars: IntradayBar[] = [];
    const table = INTRADAY_TABLE[exchange];
    if (!table) return [];

    const pool = getPool();
    const insertValues: string[] = [];
    const insertParams: (string | number)[] = [];
    let paramIdx = 1;

    for (let i = 0; i < timestamps.length; i++) {
      const c = closes[i];
      if (c == null || isNaN(c) || c === 0) continue;

      // Convert UTC timestamp → local market time string
      const utcDate = new Date(timestamps[i] * 1000);
      const localStr = utcDate.toLocaleString("sv-SE", { timeZone: tz }).replace("T", " ");

      const o = opens[i] ?? c;
      const h = highs[i] ?? c;
      const l = lows[i] ?? c;
      const v = volumes[i] ?? 0;

      bars.push({
        ts: localStr,
        open: Math.round(o * 100) / 100,
        high: Math.round(h * 100) / 100,
        low: Math.round(l * 100) / 100,
        close: Math.round(c * 100) / 100,
        volume: Math.round(v),
      });

      insertValues.push(
        `($${paramIdx}, $${paramIdx + 1}::timestamp, $${paramIdx + 2}, $${paramIdx + 3}, $${paramIdx + 4}, $${paramIdx + 5}, $${paramIdx + 6}, $${paramIdx + 7}, $${paramIdx + 8})`
      );
      insertParams.push(
        ticker, localStr,
        Math.round(o * 100) / 100, Math.round(h * 100) / 100,
        Math.round(l * 100) / 100, Math.round(c * 100) / 100,
        Math.round(v), exchange, "on_demand"
      );
      paramIdx += 9;
    }

    // Bulk upsert into per-market intraday table
    if (insertValues.length > 0) {
      const sql = `
        INSERT INTO datapai.${table} (ticker, ts, open, high, low, close, volume, exchange, source)
        VALUES ${insertValues.join(", ")}
        ON CONFLICT (ticker, ts) DO UPDATE SET
          close = EXCLUDED.close, high = EXCLUDED.high, low = EXCLUDED.low,
          open = EXCLUDED.open, volume = EXCLUDED.volume, source = EXCLUDED.source
      `;
      await pool.query(sql, insertParams);
    }

    return bars;
  } catch (err) {
    console.warn(`[intraday-on-demand] Error fetching ${ticker}:`, err);
    return [];
  } finally {
    fetchingSet.delete(key);
  }
}

/** Simple read from the intraday view (used when another request is already fetching). */
async function readFromDB(ticker: string, exchange: string): Promise<IntradayBar[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT ts::text, open, high, low, close, volume
     FROM datapai.ohlcv_intraday
     WHERE ticker = $1 AND exchange = $2
     ORDER BY ts ASC`,
    [ticker, exchange]
  );
  return rows.map((r: { ts: string; open: number; high: number; low: number; close: number; volume: number }) => ({
    ts: r.ts,
    open: Math.round(r.open * 100) / 100,
    high: Math.round(r.high * 100) / 100,
    low: Math.round(r.low * 100) / 100,
    close: Math.round(r.close * 100) / 100,
    volume: Math.round(r.volume),
  }));
}
