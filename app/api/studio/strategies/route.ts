/**
 * GET  /api/studio/strategies  — list user's strategies
 * POST /api/studio/strategies  — create a new strategy
 */

import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized", authenticated: false }, { status: 401 });
  }

  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT s.id, s.name, s.description, s.exchange, s.tickers, s.strategy_type,
            s.config, s.is_active, s.backtest_status, s.last_backtest_at,
            s.created_at, s.updated_at,
            br.results->'summary' AS latest_summary
     FROM datapai.usr_strategies s
     LEFT JOIN LATERAL (
       SELECT results FROM datapai.usr_backtest_results
       WHERE strategy_id = s.id AND status = 'completed'
       ORDER BY created_at DESC LIMIT 1
     ) br ON TRUE
     WHERE s.user_id = $1 AND s.is_active = TRUE
     ORDER BY s.updated_at DESC`,
    [user.userId],
  );

  return NextResponse.json({ ok: true, strategies: rows });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized", authenticated: false }, { status: 401 });
  }

  // TODO: check paid tier — for now allow all authenticated users
  // const tier = await getUserTier(user.userId);
  // if (tier === "free") return NextResponse.json({ error: "Upgrade required" }, { status: 403 });

  const body = await req.json().catch(() => ({})) as {
    name?: string;
    description?: string;
    exchange?: string;
    tickers?: string[] | string;
    strategy_type?: string;
    config?: Record<string, unknown>;
  };

  if (!body.name || !body.exchange || !body.config) {
    return NextResponse.json({ error: "name, exchange, and config are required" }, { status: 400 });
  }

  // Check strategy limit (max 20 per user)
  const pool = getPool();
  const { rows: countRows } = await pool.query(
    "SELECT COUNT(*)::int AS cnt FROM datapai.usr_strategies WHERE user_id = $1 AND is_active = TRUE",
    [user.userId],
  );
  if ((countRows[0]?.cnt ?? 0) >= 20) {
    return NextResponse.json({ error: "Maximum 20 strategies allowed" }, { status: 403 });
  }

  const { rows } = await pool.query(
    `INSERT INTO datapai.usr_strategies (user_id, name, description, exchange, tickers, strategy_type, config, backtest_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
     RETURNING id, name, exchange, backtest_status, created_at`,
    [
      user.userId,
      body.name,
      body.description ?? null,
      body.exchange,
      JSON.stringify(body.tickers ?? null),
      body.strategy_type ?? "custom",
      JSON.stringify(body.config),
    ],
  );

  return NextResponse.json({ ok: true, strategy: rows[0] }, { status: 201 });
}
