import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getLang } from "@/lib/getLang";
import { loadTranslations } from "@/lib/i18n";
import { getPool } from "@/lib/db";
import StrategyBuilderClient from "./StrategyBuilderClient";

export const dynamic = "force-dynamic";

export default async function CreateStrategyPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login?redirect=/studio/create");
  }
  const lang = await getLang();
  const labels = await loadTranslations(lang);

  // Load available exchanges
  const pool = getPool();
  const { rows: exchanges } = await pool.query(
    `SELECT DISTINCT exchange FROM datapai.ticker_universe WHERE is_active = TRUE ORDER BY exchange`,
  );

  return (
    <StrategyBuilderClient
      labels={labels}
      exchanges={exchanges.map((e) => e.exchange)}
    />
  );
}
