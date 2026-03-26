import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getLang } from "@/lib/getLang";
import { loadTranslations } from "@/lib/i18n";
import { getPool } from "@/lib/db";
import StudioListClient from "./StudioListClient";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login?redirect=/studio");
  }
  const lang = await getLang();
  const labels = await loadTranslations(lang);

  const pool = getPool();
  const { rows: strategies } = await pool.query(
    `SELECT s.id, s.name, s.description, s.exchange, s.strategy_type,
            s.backtest_status, s.last_backtest_at, s.created_at, s.updated_at,
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

  return <StudioListClient strategies={strategies} labels={labels} />;
}
