/**
 * POST /api/studio/strategies/[id]/backtest  — trigger manual backtest
 *
 * Sets strategy status to 'pending' so the nightly DAG picks it up.
 * For immediate backtest, calls the Python backend directly.
 */

import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const AGENT_BASE = (process.env.AGENT_BACKEND_BASE_URL ?? "").replace(/\/$/, "");

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pool = getPool();

  // Verify ownership
  const { rows } = await pool.query(
    "SELECT id, backtest_status FROM datapai.usr_strategies WHERE id = $1 AND user_id = $2 AND is_active = TRUE",
    [id, user.userId],
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
  }

  if (rows[0].backtest_status === "running") {
    return NextResponse.json({ error: "Backtest already running" }, { status: 409 });
  }

  // Mark as pending — nightly DAG will pick it up
  await pool.query(
    "UPDATE datapai.usr_strategies SET backtest_status = 'pending', updated_at = NOW() WHERE id = $1",
    [id],
  );

  return NextResponse.json({
    ok: true,
    message: "Backtest queued. Results will be available after the nightly run (02:00 UTC).",
    backtest_status: "pending",
  });
}
