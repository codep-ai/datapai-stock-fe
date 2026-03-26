/**
 * GET    /api/studio/strategies/[id]  — strategy detail + latest results
 * PUT    /api/studio/strategies/[id]  — update strategy config
 * DELETE /api/studio/strategies/[id]  — soft delete strategy
 */

import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pool = getPool();

  // Get strategy
  const { rows: stratRows } = await pool.query(
    `SELECT id, user_id, name, description, exchange, tickers, strategy_type,
            config, is_active, backtest_status, last_backtest_at, created_at, updated_at
     FROM datapai.usr_strategies
     WHERE id = $1 AND user_id = $2 AND is_active = TRUE`,
    [id, user.userId],
  );

  if (!stratRows.length) {
    return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
  }

  // Get all backtest results
  const { rows: resultRows } = await pool.query(
    `SELECT id, run_date, results, status, error_message, created_at
     FROM datapai.usr_backtest_results
     WHERE strategy_id = $1 AND user_id = $2
     ORDER BY created_at DESC
     LIMIT 10`,
    [id, user.userId],
  );

  return NextResponse.json({
    ok: true,
    strategy: stratRows[0],
    backtest_results: resultRows,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({})) as {
    name?: string;
    description?: string;
    exchange?: string;
    tickers?: string[] | string;
    strategy_type?: string;
    config?: Record<string, unknown>;
  };

  const pool = getPool();

  // Verify ownership
  const { rows: existing } = await pool.query(
    "SELECT id FROM datapai.usr_strategies WHERE id = $1 AND user_id = $2 AND is_active = TRUE",
    [id, user.userId],
  );
  if (!existing.length) {
    return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
  }

  // Build dynamic SET clause
  const sets: string[] = [];
  const vals: unknown[] = [];
  let idx = 1;

  if (body.name !== undefined) { sets.push(`name = $${idx++}`); vals.push(body.name); }
  if (body.description !== undefined) { sets.push(`description = $${idx++}`); vals.push(body.description); }
  if (body.exchange !== undefined) { sets.push(`exchange = $${idx++}`); vals.push(body.exchange); }
  if (body.tickers !== undefined) { sets.push(`tickers = $${idx++}`); vals.push(JSON.stringify(body.tickers)); }
  if (body.strategy_type !== undefined) { sets.push(`strategy_type = $${idx++}`); vals.push(body.strategy_type); }
  if (body.config !== undefined) {
    sets.push(`config = $${idx++}`);
    vals.push(JSON.stringify(body.config));
    sets.push("backtest_status = 'pending'");  // re-trigger backtest on config change
  }

  if (!sets.length) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  sets.push("updated_at = NOW()");
  vals.push(id, user.userId);

  const { rows } = await pool.query(
    `UPDATE datapai.usr_strategies SET ${sets.join(", ")}
     WHERE id = $${idx++} AND user_id = $${idx}
     RETURNING id, name, backtest_status, updated_at`,
    vals,
  );

  return NextResponse.json({ ok: true, strategy: rows[0] });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pool = getPool();

  await pool.query(
    "UPDATE datapai.usr_strategies SET is_active = FALSE, updated_at = NOW() WHERE id = $1 AND user_id = $2",
    [id, user.userId],
  );

  return NextResponse.json({ ok: true });
}
