"use client";

import type { StockFundamentals } from "@/lib/db";

// ── Formatters ───────────────────────────────────────────────────────────────

function toNum(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function fmtNum(v: unknown, decimals = 2): string {
  const n = toNum(v);
  if (n == null) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtLargeNum(v: unknown): string {
  const n = toNum(v);
  if (n == null) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function fmtPct(v: unknown): string {
  const n = toNum(v);
  if (n == null) return "—";
  const pct = Math.abs(n) < 1 ? n * 100 : n;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

function fmtPctPlain(v: unknown): string {
  const n = toNum(v);
  if (n == null) return "—";
  const pct = Math.abs(n) < 1 ? n * 100 : n;
  return `${pct.toFixed(2)}%`;
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  data: StockFundamentals;
  labels: Record<string, string>;
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className={`text-xs font-semibold ${highlight ? "text-brand" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}

export default function StockSnapshot({ data, labels }: Props) {
  const l = (key: string) => labels[key] || key;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2
        className="text-lg font-bold text-gray-800 mb-4"
        style={{ fontFamily: "var(--font-rajdhani)" }}
      >
        {l("sf_section_title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0">
        {/* Column 1: Valuation */}
        <div>
          <Row label={l("sf_market_cap")} value={fmtLargeNum(data.market_cap)} highlight />
          <Row label={l("sf_pe_ttm")} value={fmtNum(data.pe_ttm)} />
          <Row label={l("sf_pe_forward")} value={fmtNum(data.pe_forward)} />
          <Row label={l("sf_pb_ratio")} value={fmtNum(data.pb_ratio)} />
          <Row label={l("sf_ps_ratio")} value={fmtNum(data.ps_ratio)} />
          <Row label={l("sf_beta")} value={fmtNum(data.beta, 3)} />
          <Row label={l("sf_dividend_yield")} value={fmtPctPlain(data.dividend_yield)} />
          <Row label={l("sf_52w_high")} value={fmtNum(data.fifty_two_week_high)} />
          <Row label={l("sf_52w_low")} value={fmtNum(data.fifty_two_week_low)} />
        </div>

        {/* Column 2: Shares & Volume */}
        <div>
          <Row label={l("sf_shares_out")} value={fmtLargeNum(data.shares_outstanding)} />
          <Row label={l("sf_float_shares")} value={fmtLargeNum(data.float_shares)} />
          <Row label={l("sf_avg_vol_10d")} value={fmtLargeNum(data.avg_volume_10d)} />
          <Row label={l("sf_revenue_ttm")} value={fmtLargeNum(data.revenue_ttm)} />
          <Row label={l("sf_net_income")} value={fmtLargeNum(data.net_income_ttm)} />
          <Row label={l("sf_profit_margin")} value={fmtPctPlain(data.profit_margin)} />
          <Row label={l("sf_roe")} value={fmtPctPlain(data.return_on_equity)} />
          <Row label={l("sf_current_ratio")} value={fmtNum(data.current_ratio)} />
          <Row label={l("sf_debt_equity")} value={fmtNum(data.debt_to_equity)} />
        </div>

        {/* Column 3: Growth & Info */}
        <div>
          <Row label={l("sf_earnings_growth")} value={fmtPct(data.earnings_growth)} />
          <Row label={l("sf_revenue_growth")} value={fmtPct(data.revenue_growth)} />
          {data.sector && <Row label={l("sf_sector")} value={data.sector} />}
          {data.industry && <Row label={l("sf_industry")} value={data.industry} />}
          {data.updated_at && (
            <div className="pt-3 text-[10px] text-gray-300 text-right">
              Updated: {new Date(data.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
