"use client";

import { useState } from "react";
import Link from "next/link";
import { t, type Labels } from "@/lib/translations";

interface Analysis {
  id: string;
  ticker: string;
  fetched_at: string;
  url: string;
  alert_score: number;
  confidence: number;
  categories_json: string | null;
  signal_type: string;
  changed_pct?: number | null;
  quality_flags_json?: string;
  agent_signal_type: string | null;
  agent_severity: string | null;
  validation_status: string | null;
  change_type: string | null;
  corroborating_count: number | null;
}

interface Props {
  contentOnly: Analysis[];
  allSignals: Analysis[];
  universe: Record<string, string>;
  exchangeMap: Record<string, string>;
  watchlistOnly?: boolean;
  labels: Labels;
}

function scoreColor(score: number): string {
  if (score > 1) return "text-red-600";
  if (score > 0) return "text-amber-600";
  if (score < -1) return "text-green-600";
  return "text-gray-400";
}

function rowStyle(score: number): React.CSSProperties {
  if (score > 1) return { background: "#fff3e0" };
  if (score > 0) return { background: "#fffbea" };
  if (score < -1) return { background: "#f0fdf4" };
  return {};
}

function confidenceBadge(confidence: number) {
  const pct = Math.round(confidence * 100);
  const color = pct >= 80 ? "#2e8b57" : pct >= 50 ? "#f97316" : "#9ca3af";
  return (
    <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: color + "20", color }}>
      {pct}%
    </span>
  );
}

function signalTypeBadge(signalType: string, labels: Labels) {
  const colors: Record<string, { bg: string; text: string }> = {
    CONTENT_CHANGE: { bg: "#f0fdf4", text: "#166534" },
    ARCHIVE_CHANGE: { bg: "#f0f9ff", text: "#075985" },
    LAYOUT_CHANGE:  { bg: "#fafafa", text: "#6b7280" },
  };
  const c = colors[signalType] ?? { bg: "#f5f5f5", text: "#666" };
  const labelKey = `alerts_signal_${signalType.toLowerCase()}`;
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide" style={{ background: c.bg, color: c.text }}>
      {t(labels, labelKey) !== labelKey ? t(labels, labelKey) : signalType.replace(/_/g, " ")}
    </span>
  );
}

function changeTypeBadge(changeType: string | null, labels: Labels) {
  if (!changeType || changeType === "CONTENT_CHANGE") return null;
  const config: Record<string, { bg: string; text: string; key: string }> = {
    ARCHIVE_CHANGE: { bg: "#f9fafb", text: "#6b7280", key: "alerts_type_archive" },
    LAYOUT_CHANGE:  { bg: "#f0f9ff", text: "#0c4a6e", key: "alerts_type_layout" },
  };
  const c = config[changeType] ?? { bg: "#f9fafb", text: "#6b7280", key: "" };
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text, border: `1px solid ${c.text}30` }}>
      {c.key ? t(labels, c.key) : changeType}
    </span>
  );
}

function agentSignalBadge(signalType: string | null, labels: Labels) {
  if (!signalType) return null;
  const keyMap: Record<string, string> = {
    GUIDANCE_WITHDRAWAL: "alerts_agent_guidance",
    RISK_DISCLOSURE_EXPANSION: "alerts_agent_risk",
    TONE_SOFTENING: "alerts_agent_tone",
  };
  const key = keyMap[signalType];
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 uppercase tracking-wide">
      {key ? t(labels, key) : signalType.replace(/_/g, " ")}
    </span>
  );
}

function severityBadge(severity: string | null, labels: Labels) {
  if (!severity) return null;
  const colors: Record<string, { bg: string; text: string }> = {
    HIGH:   { bg: "#fef2f2", text: "#991b1b" },
    MEDIUM: { bg: "#fffbea", text: "#92400e" },
    LOW:    { bg: "#f0fdf4", text: "#166534" },
  };
  const c = colors[severity] ?? { bg: "#f5f5f5", text: "#666" };
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase" style={{ background: c.bg, color: c.text }}>
      {t(labels, `alerts_severity_${severity.toLowerCase()}`)}
    </span>
  );
}

function validationBadge(status: string | null, labels: Labels) {
  if (!status) return null;
  const config: Record<string, { bg: string; text: string; icon: string; key: string }> = {
    CONFIRMED:          { bg: "#f0fdf4", text: "#166534", icon: "✓", key: "alerts_val_confirmed" },
    PARTIALLY_CONFIRMED:{ bg: "#fffbea", text: "#92400e", icon: "~", key: "alerts_val_partial" },
    NOT_CONFIRMED_YET:  { bg: "#f0f9ff", text: "#0c4a6e", icon: "?", key: "alerts_val_unconfirmed" },
    SOURCE_UNAVAILABLE: { bg: "#f9fafb", text: "#6b7280", icon: "—", key: "alerts_val_no_source" },
  };
  const c = config[status] ?? config.SOURCE_UNAVAILABLE;
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
      {c.icon} {t(labels, c.key)}
    </span>
  );
}

export default function AlertsClient({ contentOnly, allSignals, universe, exchangeMap, watchlistOnly, labels }: Props) {
  const [showAll, setShowAll] = useState(false);
  const analyses = showAll ? allSignals : contentOnly;
  const changed = analyses.filter((a) => a.alert_score !== 0).length;
  const highConf = analyses.filter((a) => a.confidence >= 0.6).length;
  const withAgentSignal = analyses.filter((a) => a.agent_signal_type).length;
  const withInvestigation = analyses.filter((a) => (a.corroborating_count ?? 0) > 0).length;

  return (
    <div>

      {/* ── Green hero bar ── */}
      <div
        className="w-full"
        style={{ background: "linear-gradient(45deg, seagreen, darkseagreen)", paddingTop: "28px", paddingBottom: "28px" }}
      >
        <div className="max-w-6xl mx-auto px-6 space-y-3">
          <div className="flex items-center gap-4 flex-wrap">
            {watchlistOnly && (
              <Link href="/watchlist" className="text-white/70 hover:text-white text-sm font-medium">
                ← {t(labels, "alerts_my_watchlist")}
              </Link>
            )}
            <h1 className="text-2xl font-bold text-white">
              {watchlistOnly ? t(labels, "alerts_watchlist_title") : t(labels, "alerts_title")}
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm shadow-md transition-all hover:brightness-110 hover:-translate-y-0.5"
              style={!showAll ? { background: "#fd8412", color: "#fff" } : { background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
            >
              {t(labels, "alerts_content_only")}
            </button>
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm shadow-md transition-all hover:brightness-110 hover:-translate-y-0.5"
              style={showAll ? { background: "#fd8412", color: "#fff" } : { background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
            >
              {t(labels, "alerts_all_signals")}
            </button>
            {!showAll && (
              <span className="text-xs text-white/60">
                {t(labels, "alerts_filtered_out")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {changed > 0 && (
              <span className="text-sm text-white/80">
                {changed} {t(labels, "alerts_with_changes")}
              </span>
            )}
            {highConf > 0 && (
              <span className="text-sm text-white/70">
                · {highConf} {t(labels, "alerts_high_conf")}
              </span>
            )}
            {withAgentSignal > 0 && (
              <span className="text-sm text-white/70">
                · {withAgentSignal} {t(labels, "alerts_ag2_signals")}
              </span>
            )}
            {withInvestigation > 0 && (
              <span className="text-sm text-white/70">
                {t(labels, "alerts_investigated").replace("{n}", String(withInvestigation))}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-5 text-sm text-gray-500 px-1">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded inline-block flex-shrink-0" style={{ background: "#fffbea", border: "1px solid #fd8412" }} />
          {t(labels, "alerts_legend_moderate")}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded inline-block flex-shrink-0" style={{ background: "#fff3e0", border: "1px solid #fb923c" }} />
          {t(labels, "alerts_legend_high_risk")}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded inline-block flex-shrink-0" style={{ background: "#f0fdf4", border: "1px solid #4ade80" }} />
          {t(labels, "alerts_legend_positive")}
        </span>
        <span className="ml-auto text-gray-400">{t(labels, "alerts_conf_explain")}</span>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">{watchlistOnly ? "⭐" : "📡"}</div>
          <div className="text-2xl font-bold text-gray-400 mb-3">
            {watchlistOnly ? t(labels, "alerts_empty_watchlist") : t(labels, "alerts_empty")}
          </div>
          <p className="text-base text-gray-400 mb-8">
            {watchlistOnly ? t(labels, "alerts_empty_watchlist_desc") : t(labels, "alerts_empty_desc")}
          </p>
          <Link
            href={watchlistOnly ? "/watchlist" : "/"}
            className="inline-block bg-brand text-white px-8 py-3 rounded-xl text-base font-semibold hover:opacity-90"
          >
            {watchlistOnly ? t(labels, "alerts_back_watchlist") : t(labels, "alerts_go_home")}
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 text-left text-sm uppercase tracking-wide">
                <th className="py-4 px-6 font-semibold">{t(labels, "ticker_label")}</th>
                <th className="py-4 pr-6 font-semibold">{t(labels, "alerts_col_company")}</th>
                <th className="py-4 pr-6 text-right font-semibold">{t(labels, "alerts_col_score")}</th>
                <th className="py-4 pr-6 text-right font-semibold">{t(labels, "alerts_col_changed")}</th>
                <th className="py-4 pr-6 text-right font-semibold">{t(labels, "alerts_col_conf")}</th>
                <th className="py-4 pr-6 font-semibold">{t(labels, "alerts_col_signal")}</th>
                <th className="py-4 pr-6 font-semibold">{t(labels, "alerts_col_validation")}</th>
                <th className="py-4 pr-6 font-semibold">{t(labels, "alerts_col_scanned")}</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a) => {
                const cats: string[] = a.categories_json ? JSON.parse(a.categories_json) : [];
                return (
                  <tr key={a.id} className="border-b border-gray-100 hover:brightness-95 transition-colors" style={rowStyle(a.alert_score)}>
                    <td className="py-5 px-6">
                      <Link href={`/ticker/${a.ticker}?exchange=${exchangeMap[a.ticker] ?? "US"}`} className="text-brand text-lg font-bold hover:text-brand-light">
                        {a.ticker}
                      </Link>
                    </td>
                    <td className="py-5 pr-6 text-base text-gray-700 max-w-[180px] truncate">
                      {universe[a.ticker] ?? a.ticker}
                    </td>
                    <td className={`py-5 pr-6 text-right text-xl font-bold ${scoreColor(a.alert_score)}`}>
                      {a.alert_score > 0 ? "+" : ""}{a.alert_score.toFixed(2)}
                    </td>
                    <td className="py-5 pr-6 text-right text-base text-gray-700 font-medium">
                      {a.changed_pct?.toFixed(1) ?? "—"}%
                    </td>
                    <td className="py-5 pr-6 text-right">
                      {confidenceBadge(a.confidence)}
                    </td>
                    <td className="py-5 pr-6">
                      <div className="flex flex-col gap-1.5">
                        {a.agent_signal_type
                          ? agentSignalBadge(a.agent_signal_type, labels)
                          : signalTypeBadge(a.signal_type ?? "CONTENT_CHANGE", labels)}
                        <div className="flex gap-1.5 flex-wrap">
                          {changeTypeBadge(a.change_type, labels)}
                          {severityBadge(a.agent_severity, labels)}
                          {(a.corroborating_count ?? 0) > 0 && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#f3e8ff", color: "#6b21a8" }}>
                              {a.corroborating_count}
                            </span>
                          )}
                          {cats.slice(0, 1).map((c) => (
                            <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                              {c.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-6">
                      {validationBadge(a.validation_status, labels)}
                    </td>
                    <td className="py-5 pr-6 text-gray-400 text-sm whitespace-nowrap">
                      {new Date(a.fetched_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}
