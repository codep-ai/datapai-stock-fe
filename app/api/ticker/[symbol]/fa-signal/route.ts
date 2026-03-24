/**
 * GET /api/ticker/[symbol]/fa-signal?exchange=US&lang=vi
 *
 * Reads the pre-computed fundamental snapshot from the Python backend and
 * formats it into a rich investment-thesis narrative in Markdown.
 * Supports all 8 languages via DB-driven labels.
 */

import { NextRequest, NextResponse } from "next/server";
import { loadTranslations } from "@/lib/i18n";

const AGENT_BASE = (process.env.AGENT_BACKEND_BASE_URL ?? "").replace(/\/$/, "");

// ── Formatting helpers ────────────────────────────────────────────────────────

function fmt(v: number | null | undefined, dec = 1): string {
  if (v == null) return "N/A";
  return v.toFixed(dec);
}

function fmtPct(v: number | null | undefined, dec = 1): string {
  if (v == null) return "N/A";
  return `${(v * 100).toFixed(dec)}%`;
}

function fmtLarge(v: number | null | undefined, currency = ""): string {
  if (v == null) return "N/A";
  const abs = Math.abs(v);
  const sign = v < 0 ? "−" : "";
  if (abs >= 1e12) return `${sign}${currency}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9)  return `${sign}${currency}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6)  return `${sign}${currency}${(abs / 1e6).toFixed(2)}M`;
  return `${sign}${currency}${abs.toLocaleString()}`;
}

type L = Record<string, string>;
function t(labels: L, key: string): string { return labels[key] ?? key; }

function scoreBand(v: number | null, labels: L, mode: "bi" | "uni" = "bi"): string {
  if (v == null) return t(labels, "fa_insufficient_data");
  if (mode === "uni") {
    if (v >= 0.75) return t(labels, "fa_excellent");
    if (v >= 0.55) return t(labels, "fa_strong");
    if (v >= 0.35) return t(labels, "fa_moderate");
    return t(labels, "fa_weak");
  }
  if (v >=  0.5)  return `${t(labels, "fa_very_favourable")} ↑↑`;
  if (v >=  0.2)  return `${t(labels, "fa_favourable")} ↑`;
  if (v >= -0.2)  return `${t(labels, "fa_neutral")} →`;
  if (v >= -0.5)  return `${t(labels, "fa_unfavourable")} ↓`;
  return `${t(labels, "fa_very_unfavourable")} ↓↓`;
}

function signalAction(signal: string | null, labels: L): string {
  switch (signal) {
    case "STRONG_BUY":  return `⬆⬆ ${t(labels, "fa_action_strong_buy")}`;
    case "BUY":         return `⬆ ${t(labels, "fa_action_buy")}`;
    case "NEUTRAL":     return `→ ${t(labels, "fa_action_neutral")}`;
    case "SELL":        return `⬇ ${t(labels, "fa_action_sell")}`;
    case "STRONG_SELL": return `⬇⬇ ${t(labels, "fa_action_strong_sell")}`;
    default:            return `— ${t(labels, "fa_action_insufficient")}`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildMarkdown(d: Record<string, any>, ticker: string, labels: L): string {
  const cur    = (d.currency as string | null) ?? "";
  const sector = (d.sector   as string | null) ?? t(labels, "fa_this_sector");
  const signal = (d.fundamental_signal as string | null) ?? "N/A";
  const score  = d.fundamental_score != null
    ? (d.fundamental_score as number).toFixed(3) : "N/A";
  const computedAt = d.computed_at
    ? (d.computed_at as string).slice(0, 10) : "unknown";

  const lines: string[] = [];

  // ── Investment thesis header ───────────────────────────────────────────────
  lines.push(`**${t(labels, "fa_ai_verdict")}**: \`${signal.replace(/_/g, " ")}\`  ·  ${t(labels, "fa_composite_score")}: **${score}** *(−1.0 ${t(labels, "fa_bearish")} → +1.0 ${t(labels, "fa_bullish")})*`);
  lines.push(`**${t(labels, "fa_recommended_action")}**: ${signalAction(signal, labels)}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Section 1 — Company Fundamentals ──────────────────────────────────────
  lines.push(`### 🏢 ${t(labels, "fa_company_fundamentals")}`);
  if (d.company_name) {
    lines.push(`**${d.company_name}** · ${d.sector ?? ""}${d.industry ? ` › ${d.industry}` : ""}  ·  ${d.exchange ?? ticker}`);
  }
  if (d.market_cap != null) {
    lines.push(`${t(labels, "fa_market_cap")}: **${fmtLarge(d.market_cap, cur)}**${d.enterprise_value != null ? `  ·  ${t(labels, "fa_enterprise_value")}: ${fmtLarge(d.enterprise_value, cur)}` : ""}`);
  }
  lines.push("");

  // Valuation
  const vScore = d.valuation_score as number | null;
  lines.push(`**${t(labels, "fa_valuation")}** *(${t(labels, "fa_score")}: ${fmt(vScore, 2)}, ${scoreBand(vScore, labels)} vs ${sector})*`);
  const peItems = [
    d.pe_ratio    != null ? `P/E: **${fmt(d.pe_ratio, 1)}x** TTM` : null,
    d.forward_pe  != null ? `Fwd P/E: **${fmt(d.forward_pe, 1)}x**` : null,
    d.peg_ratio   != null ? `PEG: ${fmt(d.peg_ratio, 2)}` : null,
    d.pb_ratio    != null ? `P/B: ${fmt(d.pb_ratio, 2)}x` : null,
    d.ps_ratio    != null ? `P/S: ${fmt(d.ps_ratio, 2)}x` : null,
    d.ev_ebitda   != null ? `EV/EBITDA: **${fmt(d.ev_ebitda, 1)}x**` : null,
  ].filter(Boolean);
  if (peItems.length) lines.push(`- ${peItems.join("  ·  ")}`);
  if (d.fcf_yield != null) {
    const fy = d.fcf_yield as number;
    const fyLabel = fy * 100 >= 6 ? t(labels, "fa_strong_yield")
                  : fy * 100 >= 3 ? t(labels, "fa_decent_yield")
                  : t(labels, "fa_low_yield");
    lines.push(`- FCF Yield: **${fmtPct(fy)}** — ${fyLabel}`);
  }
  lines.push("");

  // Profitability & management efficiency
  const qScore = d.quality_score as number | null;
  lines.push(`**${t(labels, "fa_profitability")}** *(${t(labels, "fa_quality_score")}: ${fmt(qScore, 2)}/1.0, ${scoreBand(qScore, labels, "uni")})*`);
  const marginItems = [
    d.gross_margin     != null ? `${t(labels, "fa_gross_margin")}: **${fmtPct(d.gross_margin)}**` : null,
    d.operating_margin != null ? `${t(labels, "fa_operating_margin")}: **${fmtPct(d.operating_margin)}**` : null,
    d.net_margin       != null ? `${t(labels, "fa_net_margin")}: **${fmtPct(d.net_margin)}**` : null,
  ].filter(Boolean);
  if (marginItems.length) lines.push(`- ${marginItems.join("  ·  ")}`);

  const returnItems = [
    d.roe  != null ? `ROE: **${fmtPct(d.roe)}**`   : null,
    d.roa  != null ? `ROA: ${fmtPct(d.roa)}`        : null,
    d.roic != null ? `ROIC: **${fmtPct(d.roic)}**` : null,
  ].filter(Boolean);
  if (returnItems.length) {
    lines.push(`- ${t(labels, "fa_capital_returns")} — ${returnItems.join("  ·  ")}`);
  }

  const debtItems = [
    d.debt_to_equity  != null ? `D/E: ${fmt(d.debt_to_equity, 2)}x` : null,
    d.current_ratio   != null ? `${t(labels, "fa_current_ratio")}: ${fmt(d.current_ratio, 2)}` : null,
    d.interest_coverage != null ? `${t(labels, "fa_interest_coverage")}: **${fmt(d.interest_coverage, 1)}x**` : null,
  ].filter(Boolean);
  if (debtItems.length) lines.push(`- ${t(labels, "fa_leverage")} — ${debtItems.join("  ·  ")}`);

  if (d.total_cash != null || d.net_cash != null) {
    const bsItems = [
      d.total_cash != null ? `${t(labels, "fa_cash")}: ${fmtLarge(d.total_cash, cur)}` : null,
      d.total_debt != null ? `${t(labels, "fa_debt")}: ${fmtLarge(d.total_debt, cur)}` : null,
      d.net_cash   != null ? `${t(labels, "fa_net_cash")}: **${fmtLarge(d.net_cash, cur)}**` : null,
    ].filter(Boolean);
    lines.push(`- ${t(labels, "fa_balance_sheet")} — ${bsItems.join("  ·  ")}`);
  }
  lines.push("");

  // ── Section 2 — Growth & Cash Flow ────────────────────────────────────────
  const gScore = d.growth_score as number | null;
  lines.push(`### 📈 ${t(labels, "fa_growth_cashflow")}  *(${t(labels, "fa_score")}: ${fmt(gScore, 2)}/1.0, ${scoreBand(gScore, labels, "uni")})*`);
  lines.push("");

  if (d.revenue_yoy != null || d.revenue_growth_5yr != null) {
    const revItems = [
      d.revenue_yoy        != null ? `YoY: **${fmtPct(d.revenue_yoy)}**` : null,
      d.revenue_growth_5yr != null ? `5yr CAGR: **${fmtPct(d.revenue_growth_5yr)}**` : null,
    ].filter(Boolean);
    lines.push(`- ${t(labels, "fa_revenue_growth")} — ${revItems.join("  ·  ")}`);
  }

  if (d.earnings_yoy != null || d.eps_growth_5yr != null) {
    const epsItems = [
      d.earnings_yoy   != null ? `YoY: **${fmtPct(d.earnings_yoy)}**` : null,
      d.eps_growth_5yr != null ? `5yr CAGR: **${fmtPct(d.eps_growth_5yr)}**` : null,
    ].filter(Boolean);
    lines.push(`- ${t(labels, "fa_earnings_growth")} — ${epsItems.join("  ·  ")}`);
  }

  if (d.free_cash_flow != null) {
    const fcfItems = [
      `FCF: **${fmtLarge(d.free_cash_flow, cur)}**`,
      d.fcf_per_share      != null ? `${t(labels, "fa_per_share")}: ${fmt(d.fcf_per_share, 2)}` : null,
      d.operating_cf_margin != null ? `${t(labels, "fa_op_cf_margin")}: **${fmtPct(d.operating_cf_margin)}**` : null,
    ].filter(Boolean);
    lines.push(`- ${t(labels, "fa_free_cash_flow")} — ${fcfItems.join("  ·  ")}`);
  }

  if (d.dividend_yield != null && (d.dividend_yield as number) > 0.001) {
    lines.push(`- ${t(labels, "fa_dividend")}: **${fmtPct(d.dividend_yield)}**  ·  ${t(labels, "fa_payout_ratio")}: ${fmtPct(d.payout_ratio)}`);
  }

  if (d.beta != null) {
    const betaVal = d.beta as number;
    const betaComment = betaVal > 1.5 ? t(labels, "fa_high_volatility")
                      : betaVal > 1.0 ? t(labels, "fa_moderate_volatility")
                      : betaVal < 0.5 ? t(labels, "fa_low_beta")
                      : t(labels, "fa_market_volatility");
    lines.push(`- Beta: **${fmt(betaVal, 2)}** (${betaComment})${d.short_ratio != null ? `  ·  Short ratio: ${fmt(d.short_ratio, 1)}` : ""}`);
  }

  if (d.next_earnings_date) {
    lines.push(`- **${t(labels, "fa_next_earnings")}**: ${(d.next_earnings_date as string).slice(0, 10)}`);
  }
  lines.push("");

  // ── Section 3 — Macro & Geopolitical ──────────────────────────────────────
  const mScore = d.macro_score as number | null;
  lines.push(`### 🌍 ${t(labels, "fa_macro_geo")}  *(${t(labels, "fa_macro_score")}: ${fmt(mScore, 2)}, ${scoreBand(mScore, labels)})*`);
  lines.push("");

  if (d.macro_summary) {
    lines.push(d.macro_summary as string);
    lines.push("");
  }

  const macroFactors = d.macro_factors as string[] | null;
  if (macroFactors && macroFactors.length > 0) {
    lines.push(`**${t(labels, "fa_key_macro")}:**`);
    for (const f of macroFactors) lines.push(`- ${f}`);
    lines.push("");
  }

  const geoFlags = d.geopolitical_flags as string[] | null;
  if (geoFlags && geoFlags.length > 0) {
    lines.push(`**${t(labels, "fa_geo_flags")}:**`);
    for (const g of geoFlags) lines.push(`- ⚑ ${g}`);
    lines.push("");
  }

  const techRisk = d.tech_disruption_risk as string | null;
  if (techRisk && techRisk !== "UNKNOWN") {
    const riskNote = techRisk === "HIGH"   ? t(labels, "fa_disruption_high")
                   : techRisk === "MEDIUM" ? t(labels, "fa_disruption_medium")
                   : t(labels, "fa_disruption_low");
    lines.push(`**${t(labels, "fa_ai_disruption")}**: **${techRisk}** — ${riskNote}`);
    lines.push("");
  }

  // ── Section 4 — Market & Analyst Sentiment ────────────────────────────────
  if (d.analyst_consensus) {
    lines.push(`### 👥 ${t(labels, "fa_analyst_sentiment")}`);
    const upside = d.analyst_upside_pct as number | null;
    const target = d.analyst_target_price as number | null;
    lines.push(
      `${t(labels, "fa_consensus")}: **${d.analyst_consensus}**` +
      (target != null ? `  ·  ${t(labels, "fa_price_target")}: ${cur}${target.toFixed(2)}` : "") +
      (upside != null ? `  ·  ${t(labels, "fa_implied_upside")}: **${upside >= 0 ? "+" : ""}${upside.toFixed(1)}%**` : "")
    );
    lines.push("");
  }

  // ── Section 5 — AI Investment Summary ─────────────────────────────────────
  if (d.fundamental_summary) {
    lines.push(`### 📝 ${t(labels, "fa_ai_summary")}`);
    lines.push(d.fundamental_summary as string);
    lines.push("");
  }

  // ── Section 6 — Strengths & Risks ─────────────────────────────────────────
  const strengths = d.key_strengths as string[] | null;
  const risks     = d.key_risks     as string[] | null;
  if ((strengths?.length ?? 0) > 0 || (risks?.length ?? 0) > 0) {
    if (strengths && strengths.length > 0) {
      lines.push(`**${t(labels, "fa_why_buy")}:**`);
      for (const s of strengths) lines.push(`✅ ${s}`);
      lines.push("");
    }
    if (risks && risks.length > 0) {
      lines.push(`**${t(labels, "fa_key_risks")}:**`);
      for (const r of risks) lines.push(`⚠️ ${r}`);
      lines.push("");
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push(
    `*${t(labels, "fa_data_source")} · ${t(labels, "fa_computed")} ${computedAt}` +
    (d.sector   ? ` · ${d.sector}` : "") +
    (d.industry ? ` › ${d.industry}` : "") +
    ` · **${t(labels, "fa_not_advice")}***`
  );

  return lines.join("\n");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const exchange = (req.nextUrl.searchParams.get("exchange") ?? "US").toUpperCase();
  const SUPPORTED_LANGS = ["en", "zh", "zh-TW", "ja", "ko", "vi", "th", "ms"];
  const langParam = req.nextUrl.searchParams.get("lang") ?? "en";
  const lang = SUPPORTED_LANGS.includes(langParam) ? langParam : "en";
  const sym = symbol.toUpperCase();

  if (!AGENT_BASE) {
    return NextResponse.json(
      { ok: false, error: "AGENT_BACKEND_BASE_URL not configured" },
      { status: 503 }
    );
  }

  try {
    const [labels, res] = await Promise.all([
      loadTranslations(lang),
      fetch(
        `${AGENT_BASE}/agent/fundamental-snapshot?ticker=${encodeURIComponent(sym)}&exchange=${encodeURIComponent(exchange)}`,
        { cache: "no-store" }
      ),
    ]);
    const json = await res.json();

    if (!json.ok || !json.data) {
      const errMsg = typeof json.error === "object" && json.error !== null
        ? (json.error as Record<string, string>).message ?? JSON.stringify(json.error)
        : (json.error as string | undefined)
          ?? `No fundamental data found for ${sym}. Run: python3 scripts/compute_fundamental_daily.py --exchange ${exchange} --tickers ${sym}`;
      return NextResponse.json({ ok: false, error: errMsg }, { status: 404 });
    }

    const d = json.data as Record<string, unknown>;
    const signal_markdown = buildMarkdown(d, sym, labels);

    return NextResponse.json({
      ok: true,
      data: {
        signal_markdown,
        fundamental_signal: d.fundamental_signal as string | null,
        fundamental_score:  d.fundamental_score  as number | null,
        company_name:       d.company_name        as string | null,
        sector:             d.sector              as string | null,
        computed_at:        d.computed_at         as string | null,
        cached:             true,
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}
