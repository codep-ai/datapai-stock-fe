/**
 * GET /api/performance
 * Returns signal performance data from datapai.signal_performance.
 * Supports filtering by exchange, direction, and date range.
 */
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exchange = searchParams.get("exchange") ?? "";
  const direction = searchParams.get("direction") ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "500"), 2000);

  try {
    const pool = getPool();
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (exchange) {
      conditions.push(`exchange = $${idx++}`);
      params.push(exchange);
    }
    if (direction) {
      conditions.push(`signal_direction = $${idx++}`);
      params.push(direction);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Summary stats
    const statsRes = await pool.query(
      `SELECT
         COUNT(*) AS total_signals,
         COUNT(*) FILTER (WHERE outcome = 'win') AS wins,
         COUNT(*) FILTER (WHERE outcome = 'loss') AS losses,
         ROUND(100.0 * COUNT(*) FILTER (WHERE outcome = 'win') / NULLIF(COUNT(*), 0), 1) AS win_rate,
         ROUND(AVG(return_7d)::numeric, 2) AS avg_return_7d,
         ROUND(AVG(return_30d)::numeric, 2) AS avg_return_30d,
         ROUND(AVG(return_90d)::numeric, 2) AS avg_return_90d,
         ROUND(AVG(alpha_7d)::numeric, 2) AS avg_alpha_7d,
         ROUND(AVG(alpha_30d)::numeric, 2) AS avg_alpha_30d,
         ROUND(AVG(alpha_90d)::numeric, 2) AS avg_alpha_90d
       FROM datapai.signal_performance ${where}`,
      params
    );

    // Per-direction stats
    const dirStatsRes = await pool.query(
      `SELECT
         signal_direction,
         COUNT(*) AS total,
         ROUND(100.0 * COUNT(*) FILTER (WHERE outcome = 'win') / NULLIF(COUNT(*), 0), 1) AS win_rate,
         ROUND(AVG(return_30d)::numeric, 2) AS avg_return_30d,
         ROUND(AVG(alpha_30d)::numeric, 2) AS avg_alpha_30d
       FROM datapai.signal_performance ${where}
       GROUP BY signal_direction
       ORDER BY total DESC`,
      params
    );

    // Per-exchange stats
    const exStatsRes = await pool.query(
      `SELECT
         exchange,
         COUNT(*) AS total,
         ROUND(100.0 * COUNT(*) FILTER (WHERE outcome = 'win') / NULLIF(COUNT(*), 0), 1) AS win_rate,
         ROUND(AVG(return_30d)::numeric, 2) AS avg_return_30d
       FROM datapai.signal_performance ${where}
       GROUP BY exchange
       ORDER BY total DESC`,
      params
    );

    // Recent signals (for the table)
    const recentRes = await pool.query(
      `SELECT ticker, exchange, signal_direction, signal_date, signal_price,
              return_7d, return_30d, return_90d, alpha_30d, outcome
       FROM datapai.signal_performance ${where}
       ORDER BY signal_date DESC
       LIMIT $${idx}`,
      [...params, limit]
    );

    return NextResponse.json({
      ok: true,
      summary: statsRes.rows[0],
      by_direction: dirStatsRes.rows,
      by_exchange: exStatsRes.rows,
      signals: recentRes.rows,
    });
  } catch (err) {
    console.error("Performance API error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
