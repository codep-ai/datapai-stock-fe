"use client";

import Link from "next/link";

type Labels = Record<string, string>;
function L(labels: Labels, key: string, fallback: string): string {
  return labels[key] ?? fallback;
}

interface Strategy {
  id: number;
  name: string;
  description: string | null;
  exchange: string;
  strategy_type: string;
  backtest_status: string;
  last_backtest_at: string | null;
  created_at: string;
  updated_at: string;
  latest_summary: {
    total_return_pct?: number;
    sharpe_ratio?: number;
    max_drawdown_pct?: number;
    win_rate_pct?: number;
    alpha_pct?: number;
    total_trades?: number;
  } | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700" },
  running: { bg: "bg-blue-50", text: "text-blue-700" },
  completed: { bg: "bg-green-50", text: "text-green-700" },
  failed: { bg: "bg-red-50", text: "text-red-700" },
};

const TYPE_LABELS: Record<string, string> = {
  momentum: "Momentum",
  mean_reversion: "Mean Reversion",
  breakout: "Breakout",
  custom: "Custom",
};

export default function StudioListClient({
  strategies,
  labels,
}: {
  strategies: Strategy[];
  labels: Labels;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {L(labels, "studio_title", "Agent Studio")}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {L(labels, "studio_subtitle", "Build, test, and optimise your trading strategies with AI-powered backtesting")}
          </p>
        </div>
        <Link
          href="/studio/create"
          className="inline-flex items-center gap-2 bg-[#2e8b57] text-white font-semibold rounded-lg px-5 py-2.5 hover:bg-[#247048] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          {L(labels, "studio_create_new", "New Strategy")}
        </Link>
      </div>

      {/* Empty state */}
      {strategies.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">&#x1f9ea;</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {L(labels, "studio_empty_title", "No strategies yet")}
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            {L(labels, "studio_empty_desc", "Create your first trading strategy and run a backtest to see how it would have performed.")}
          </p>
          <Link
            href="/studio/create"
            className="inline-flex items-center gap-2 bg-[#2e8b57] text-white font-semibold rounded-lg px-6 py-2.5 hover:bg-[#247048] transition-colors"
          >
            {L(labels, "studio_create_first", "Create Your First Strategy")}
          </Link>
        </div>
      )}

      {/* Strategy grid */}
      {strategies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {strategies.map((s) => {
            const sc = STATUS_COLORS[s.backtest_status] ?? STATUS_COLORS.pending;
            const summary = s.latest_summary;
            return (
              <Link
                key={s.id}
                href={`/studio/${s.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#2e8b57] transition-colors">
                      {s.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 font-medium">{s.exchange}</span>
                      <span className="text-xs text-gray-300">|</span>
                      <span className="text-xs text-gray-400">{TYPE_LABELS[s.strategy_type] ?? s.strategy_type}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                    {s.backtest_status}
                  </span>
                </div>

                {s.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{s.description}</p>
                )}

                {/* Results summary */}
                {summary && summary.total_trades !== undefined && summary.total_trades > 0 ? (
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50">
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">{L(labels, "studio_return", "Return")}</div>
                      <div className={`text-sm font-bold ${(summary.total_return_pct ?? 0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {(summary.total_return_pct ?? 0) >= 0 ? "+" : ""}{(summary.total_return_pct ?? 0).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">{L(labels, "studio_sharpe", "Sharpe")}</div>
                      <div className="text-sm font-bold text-gray-800">{(summary.sharpe_ratio ?? 0).toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">{L(labels, "studio_alpha", "Alpha")}</div>
                      <div className={`text-sm font-bold ${(summary.alpha_pct ?? 0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {(summary.alpha_pct ?? 0) >= 0 ? "+" : ""}{(summary.alpha_pct ?? 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-gray-50 text-xs text-gray-400 italic">
                    {s.backtest_status === "pending"
                      ? L(labels, "studio_pending_msg", "Backtest queued — results available after nightly run")
                      : s.backtest_status === "running"
                        ? L(labels, "studio_running_msg", "Backtest in progress...")
                        : s.backtest_status === "failed"
                          ? L(labels, "studio_failed_msg", "Backtest failed — edit strategy and retry")
                          : L(labels, "studio_no_results", "No results yet")
                    }
                  </div>
                )}

                {/* Footer */}
                <div className="mt-3 text-xs text-gray-400">
                  {s.last_backtest_at
                    ? `Last run: ${new Date(s.last_backtest_at).toLocaleDateString()}`
                    : `Created: ${new Date(s.created_at).toLocaleDateString()}`
                  }
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
