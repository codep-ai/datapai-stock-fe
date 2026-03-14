/**
 * GET /api/ticker/[symbol]/fa-signal?exchange=US
 *
 * Reads the pre-computed fundamental snapshot from the Python backend and
 * formats it into a rich investment-thesis narrative in Markdown.
 *
 * Covers BOTH micro (company cashflow, OPEX/CAPEX, management efficiency,
 * valuation) AND macro (rates, trade policy, geopolitics, sector trends)
 * dimensions — the full "should I buy / sell / hold?" picture.
 *
 * Returns the same { ok, data: { signal_markdown, ... } } shape as ta-signal
 * so TechAnalyticsPanel can render it identically.
 */

import { NextRequest, NextResponse } from "next/server";

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

function scoreBand(v: number | null, mode: "bi" | "uni" = "bi"): string {
  if (v == null) return "insufficient data";
  if (mode === "uni") {
    if (v >= 0.75) return "excellent";
    if (v >= 0.55) return "strong";
    if (v >= 0.35) return "moderate";
    return "weak";
  }
  if (v >=  0.5)  return "very favourable ↑↑";
  if (v >=  0.2)  return "favourable ↑";
  if (v >= -0.2)  return "neutral →";
  if (v >= -0.5)  return "unfavourable ↓";
  return "very unfavourable ↓↓";
}

function signalAction(signal: string | null): string {
  switch (signal) {
    case "STRONG_BUY":  return "⬆⬆ Strong case to accumulate / buy";
    case "BUY":         return "⬆ Lean toward buying or holding long";
    case "NEUTRAL":     return "→ Hold — wait for clearer catalysts";
    case "SELL":        return "⬇ Consider trimming or reducing exposure";
    case "STRONG_SELL": return "⬇⬇ Strong case to exit the position";
    default:            return "— Insufficient data to form a view";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildMarkdown(d: Record<string, any>, ticker: string): string {
  const cur    = (d.currency as string | null) ?? "";
  const sector = (d.sector   as string | null) ?? "this sector";
  const signal = (d.fundamental_signal as string | null) ?? "N/A";
  const score  = d.fundamental_score != null
    ? (d.fundamental_score as number).toFixed(3) : "N/A";
  const computedAt = d.computed_at
    ? (d.computed_at as string).slice(0, 10) : "unknown";

  const lines: string[] = [];

  // ── Investment thesis header ───────────────────────────────────────────────
  lines.push(`**AI verdict**: \`${signal.replace(/_/g, " ")}\`  ·  Composite score: **${score}** *(−1.0 bearish → +1.0 bullish)*`);
  lines.push(`**Recommended action**: ${signalAction(signal)}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Section 1 — Company Fundamentals (Micro) ──────────────────────────────
  lines.push("### 🏢 Company Fundamentals");
  if (d.company_name) {
    lines.push(`**${d.company_name}** · ${d.sector ?? ""}${d.industry ? ` › ${d.industry}` : ""}  ·  ${d.exchange ?? ticker}`);
  }
  if (d.market_cap != null) {
    lines.push(`Market cap: **${fmtLarge(d.market_cap, cur)}**${d.enterprise_value != null ? `  ·  Enterprise value: ${fmtLarge(d.enterprise_value, cur)}` : ""}`);
  }
  lines.push("");

  // Valuation
  const vScore = d.valuation_score as number | null;
  lines.push(`**Valuation** *(score: ${fmt(vScore, 2)}, ${scoreBand(vScore)} vs ${sector} peers)*`);
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
    const fyLabel = fy * 100 >= 6 ? "strong shareholder yield"
                  : fy * 100 >= 3 ? "decent cash return"
                  : "low cash yield";
    lines.push(`- FCF Yield: **${fmtPct(fy)}** — ${fyLabel}`);
  }
  lines.push("");

  // Profitability & management efficiency (OPEX/CAPEX effectiveness)
  const qScore = d.quality_score as number | null;
  lines.push(`**Profitability & Management Efficiency** *(quality score: ${fmt(qScore, 2)}/1.0, ${scoreBand(qScore, "uni")})*`);
  const marginItems = [
    d.gross_margin     != null ? `Gross margin: **${fmtPct(d.gross_margin)}**` : null,
    d.operating_margin != null ? `Operating margin: **${fmtPct(d.operating_margin)}**` : null,
    d.net_margin       != null ? `Net margin: **${fmtPct(d.net_margin)}**` : null,
  ].filter(Boolean);
  if (marginItems.length) lines.push(`- ${marginItems.join("  ·  ")}`);

  const returnItems = [
    d.roe  != null ? `ROE: **${fmtPct(d.roe)}**`   : null,
    d.roa  != null ? `ROA: ${fmtPct(d.roa)}`        : null,
    d.roic != null ? `ROIC: **${fmtPct(d.roic)}**` : null,
  ].filter(Boolean);
  if (returnItems.length) {
    lines.push(`- Capital returns — ${returnItems.join("  ·  ")}  *(high ROIC = management deploying capital effectively)*`);
  }

  const debtItems = [
    d.debt_to_equity  != null ? `D/E: ${fmt(d.debt_to_equity, 2)}x` : null,
    d.current_ratio   != null ? `Current ratio: ${fmt(d.current_ratio, 2)}` : null,
    d.interest_coverage != null ? `Interest coverage: **${fmt(d.interest_coverage, 1)}x**` : null,
  ].filter(Boolean);
  if (debtItems.length) lines.push(`- Leverage & liquidity — ${debtItems.join("  ·  ")}`);

  if (d.total_cash != null || d.net_cash != null) {
    const bsItems = [
      d.total_cash != null ? `Cash: ${fmtLarge(d.total_cash, cur)}` : null,
      d.total_debt != null ? `Debt: ${fmtLarge(d.total_debt, cur)}` : null,
      d.net_cash   != null ? `Net cash position: **${fmtLarge(d.net_cash, cur)}**` : null,
    ].filter(Boolean);
    lines.push(`- Balance sheet — ${bsItems.join("  ·  ")}`);
  }
  lines.push("");

  // ── Section 2 — Growth & Cash Flow (Business Momentum) ────────────────────
  const gScore = d.growth_score as number | null;
  lines.push(`### 📈 Growth & Cash Flow  *(score: ${fmt(gScore, 2)}/1.0, ${scoreBand(gScore, "uni")})*`);
  lines.push("");

  if (d.revenue_yoy != null || d.revenue_growth_5yr != null) {
    const revItems = [
      d.revenue_yoy        != null ? `YoY: **${fmtPct(d.revenue_yoy)}**` : null,
      d.revenue_growth_5yr != null ? `5yr CAGR: **${fmtPct(d.revenue_growth_5yr)}**` : null,
    ].filter(Boolean);
    lines.push(`- Revenue growth — ${revItems.join("  ·  ")}`);
  }

  if (d.earnings_yoy != null || d.eps_growth_5yr != null) {
    const epsItems = [
      d.earnings_yoy   != null ? `YoY: **${fmtPct(d.earnings_yoy)}**` : null,
      d.eps_growth_5yr != null ? `5yr CAGR: **${fmtPct(d.eps_growth_5yr)}**` : null,
    ].filter(Boolean);
    lines.push(`- Earnings growth — ${epsItems.join("  ·  ")}`);
  }

  if (d.free_cash_flow != null) {
    const fcfItems = [
      `FCF: **${fmtLarge(d.free_cash_flow, cur)}**`,
      d.fcf_per_share      != null ? `per share: ${fmt(d.fcf_per_share, 2)}` : null,
      d.operating_cf_margin != null ? `op. CF margin: **${fmtPct(d.operating_cf_margin)}**` : null,
    ].filter(Boolean);
    lines.push(`- Free cash flow — ${fcfItems.join("  ·  ")}  *(FCF is the truest measure of business health)*`);
  }

  if (d.dividend_yield != null && (d.dividend_yield as number) > 0.001) {
    lines.push(`- Dividend: **${fmtPct(d.dividend_yield)}** yield  ·  Payout ratio: ${fmtPct(d.payout_ratio)}`);
  }

  if (d.beta != null) {
    const betaVal = d.beta as number;
    const betaComment = betaVal > 1.5 ? "high volatility vs market"
                      : betaVal > 1.0 ? "moderately higher volatility"
                      : betaVal < 0.5 ? "low-beta defensive"
                      : "close to market volatility";
    lines.push(`- Beta: **${fmt(betaVal, 2)}** (${betaComment})${d.short_ratio != null ? `  ·  Short ratio: ${fmt(d.short_ratio, 1)} days` : ""}`);
  }

  if (d.next_earnings_date) {
    lines.push(`- **Next earnings date**: ${(d.next_earnings_date as string).slice(0, 10)}`);
  }
  lines.push("");

  // ── Section 3 — Macro & Geopolitical (Big Picture) ────────────────────────
  const mScore = d.macro_score as number | null;
  lines.push(`### 🌍 Macro & Geopolitical Environment  *(macro score: ${fmt(mScore, 2)}, ${scoreBand(mScore)})*`);
  lines.push("");
  lines.push(`*Sector-level analysis for **${sector}** via Gemini real-time grounding — covers interest rates, trade policy, geopolitical risks, sector regulation, and AI disruption.*`);
  lines.push("");

  if (d.macro_summary) {
    lines.push(d.macro_summary as string);
    lines.push("");
  }

  const macroFactors = d.macro_factors as string[] | null;
  if (macroFactors && macroFactors.length > 0) {
    lines.push("**Key macro factors for this sector:**");
    for (const f of macroFactors) lines.push(`- ${f}`);
    lines.push("");
  }

  const geoFlags = d.geopolitical_flags as string[] | null;
  if (geoFlags && geoFlags.length > 0) {
    lines.push("**Geopolitical flags to monitor:**");
    for (const g of geoFlags) lines.push(`- ⚑ ${g}`);
    lines.push("");
  }

  const techRisk = d.tech_disruption_risk as string | null;
  if (techRisk && techRisk !== "UNKNOWN") {
    const riskNote = techRisk === "HIGH"   ? "sector faces material disruption from AI/automation"
                   : techRisk === "MEDIUM" ? "some disruption risk; companies adapting to AI are better positioned"
                   : "sector is relatively insulated from near-term AI disruption";
    lines.push(`**AI & tech disruption risk**: **${techRisk}** — ${riskNote}`);
    lines.push("");
  }

  // ── Section 4 — Market & Analyst Sentiment ────────────────────────────────
  if (d.analyst_consensus) {
    lines.push("### 👥 Market & Analyst Sentiment");
    const upside = d.analyst_upside_pct as number | null;
    const target = d.analyst_target_price as number | null;
    lines.push(
      `Wall St. consensus: **${d.analyst_consensus}**` +
      (target != null ? `  ·  Price target: ${cur}${target.toFixed(2)}` : "") +
      (upside != null ? `  ·  Implied upside: **${upside >= 0 ? "+" : ""}${upside.toFixed(1)}%**` : "")
    );
    lines.push("");
    lines.push("*Note: IR page changes, management announcements and insider activity are tracked by the **Technical Signal** (TinyFish IR scan) above — check that section for the latest company-specific news impact.*");
    lines.push("");
  }

  // ── Section 5 — AI Investment Summary ─────────────────────────────────────
  if (d.fundamental_summary) {
    lines.push("### 📝 AI Investment Summary");
    lines.push(d.fundamental_summary as string);
    lines.push("");
  }

  // ── Section 6 — Strengths & Risks ─────────────────────────────────────────
  const strengths = d.key_strengths as string[] | null;
  const risks     = d.key_risks     as string[] | null;
  if ((strengths?.length ?? 0) > 0 || (risks?.length ?? 0) > 0) {
    if (strengths && strengths.length > 0) {
      lines.push("**Why BUY / What's working:**");
      for (const s of strengths) lines.push(`✅ ${s}`);
      lines.push("");
    }
    if (risks && risks.length > 0) {
      lines.push("**Key risks / What could go wrong:**");
      for (const r of risks) lines.push(`⚠️ ${r}`);
      lines.push("");
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push(
    `*Fundamental data: yfinance + Gemini grounding · Computed ${computedAt}` +
    (d.sector   ? ` · ${d.sector}` : "") +
    (d.industry ? ` › ${d.industry}` : "") +
    ` · **Not financial advice** — combine with TA signal and your own research*`
  );

  return lines.join("\n");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const exchange = (req.nextUrl.searchParams.get("exchange") ?? "US").toUpperCase();
  const sym = symbol.toUpperCase();

  if (!AGENT_BASE) {
    return NextResponse.json(
      { ok: false, error: "AGENT_BACKEND_BASE_URL not configured" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `${AGENT_BASE}/agent/fundamental-snapshot?ticker=${encodeURIComponent(sym)}&exchange=${encodeURIComponent(exchange)}`,
      { cache: "no-store" }
    );
    const json = await res.json();

    if (!json.ok || !json.data) {
      // Extract plain-text error message from Python backend (may be object or string)
      const errMsg = typeof json.error === "object" && json.error !== null
        ? (json.error as Record<string, string>).message ?? JSON.stringify(json.error)
        : (json.error as string | undefined)
          ?? `No fundamental data found for ${sym}. Run: python3 scripts/compute_fundamental_daily.py --exchange ${exchange} --tickers ${sym}`;
      return NextResponse.json({ ok: false, error: errMsg }, { status: 404 });
    }

    const d = json.data as Record<string, unknown>;
    const signal_markdown = buildMarkdown(d, sym);

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
