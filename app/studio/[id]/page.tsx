import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getLang } from "@/lib/getLang";
import { loadTranslations } from "@/lib/i18n";
import { getPool } from "@/lib/db";
import StudioResultClient from "./StudioResultClient";

export const dynamic = "force-dynamic";

export default async function StrategyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login?redirect=/studio");
  }
  const { id } = await params;
  const lang = await getLang();
  const labels = await loadTranslations(lang);

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
    notFound();
  }

  // Get latest backtest result
  const { rows: resultRows } = await pool.query(
    `SELECT id, run_date, results, status, error_message, created_at
     FROM datapai.usr_backtest_results
     WHERE strategy_id = $1 AND user_id = $2
     ORDER BY created_at DESC
     LIMIT 5`,
    [id, user.userId],
  );

  return (
    <StudioResultClient
      strategy={stratRows[0]}
      backtestResults={resultRows}
      labels={labels}
    />
  );
}
