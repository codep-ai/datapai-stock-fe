"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

type Labels = Record<string, string>;
function L(labels: Labels, key: string, fallback: string): string {
  return labels[key] ?? fallback;
}

interface BacktestResult {
  id: number;
  run_date: string;
  results: {
    summary?: {
      total_return_pct?: number;
      annualized_return_pct?: number;
      sharpe_ratio?: number;
      max_drawdown_pct?: number;
      win_rate_pct?: number;
      total_trades?: number;
      avg_trade_return_pct?: number;
      benchmark_return_pct?: number;
      alpha_pct?: number;
      initial_capital?: number;
      final_capital?: number;
    };
    trades?: Array<{
      ticker: string;
      entry_date: string;
      entry_price: number;
      exit_date: string;
      exit_price: number;
      return_pct: number;
      entry_signal?: string;
      exit_signal?: string;
    }>;
    equity_curve?: Array<{ date: string; value: number }>;
    monthly_returns?: Array<{ month: string; return_pct: number }>;
  } | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface Strategy {
  id: number;
  name: string;
  description: string | null;
  exchange: string;
  strategy_type: string;
  backtest_status: string;
  config: Record<string, unknown>;
  last_backtest_at: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  running: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

export default function StudioResultClient({
  strategy,
  backtestResults,
  labels,
}: {
  strategy: Strategy;
  backtestResults: BacktestResult[];
  labels: Labels;
}) {
  const router = useRouter();
  const [triggering, setTriggering] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState<"overview" | "trades" | "monthly">("overview");

  const latest = backtestResults.find((r) => r.status === "completed");
  const summary = latest?.results?.summary;
  const trades = latest?.results?.trades ?? [];
  const equityCurve = latest?.results?.equity_curve ?? [];
  const monthlyReturns = latest?.results?.monthly_returns ?? [];

  const triggerBacktest = async () => {
    setTriggering(true);
    try {
      await fetch(`/api/studio/strategies/${strategy.id}/backtest`, { method: "POST" });
      router.refresh();
    } catch {}
    setTriggering(false);
  };

  const deleteStrategy = async () => {
    if (!confirm("Are you sure you want to delete this strategy?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/studio/strategies/${strategy.id}`, { method: "DELETE" });
      router.push("/studio");
    } catch {}
    setDeleting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <a href="/studio" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            &larr; {L(labels, "studio_back", "Back to Studio")}
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{strategy.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-400">{strategy.exchange}</span>
            <span className="text-sm text-gray-300">|</span>
            <span className="text-sm text-gray-400 capitalize">{strategy.strategy_type}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[strategy.backtest_status] ?? ""}`}>
              {strategy.backtest_status}
            </span>
          </div>
          {strategy.description && (
            <p className="text-sm text-gray-500 mt-2">{strategy.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={triggerBacktest}
            disabled={triggering || strategy.backtest_status === "running"}
            className="px-4 py-2 bg-[#2e8b57] text-white text-sm font-medium rounded-lg hover:bg-[#247048] disabled:opacity-50 transition-colors"
          >
            {triggering ? "Queuing..." : L(labels, "studio_run_backtest", "Run Backtest")}
          </button>
          <button
            onClick={deleteStrategy}
            disabled={deleting}
            className="px-4 py-2 bg-white text-red-500 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {L(labels, "studio_delete", "Delete")}
          </button>
        </div>
      </div>

      {/* No results state */}
      {!summary && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">&#x23f3;</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {strategy.backtest_status === "pending"
              ? L(labels, "studio_pending_title", "Backtest Queued")
              : strategy.backtest_status === "running"
                ? L(labels, "studio_running_title", "Backtest Running")
                : L(labels, "studio_no_results_title", "No Results")
            }
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {strategy.backtest_status === "pending"
              ? L(labels, "studio_pending_desc", "Your backtest is queued. Results will be available after the nightly run at 02:00 UTC.")
              : strategy.backtest_status === "running"
                ? L(labels, "studio_running_desc", "Your backtest is currently running. Please check back shortly.")
                : strategy.backtest_status === "failed"
                  ? L(labels, "studio_failed_desc", "The backtest failed. Try editing your strategy and running again.")
                  : L(labels, "studio_no_results_desc", "Click 'Run Backtest' to start.")
            }
          </p>
          {backtestResults.find((r) => r.status === "failed") && (
            <p className="text-sm text-red-500 mt-3">
              Error: {backtestResults.find((r) => r.status === "failed")?.error_message}
            </p>
          )}
        </div>
      )}

      {/* Results dashboard */}
      {summary && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <SummaryCard
              label={L(labels, "studio_total_return", "Total Return")}
              value={`${(summary.total_return_pct ?? 0) >= 0 ? "+" : ""}${(summary.total_return_pct ?? 0).toFixed(1)}%`}
              color={(summary.total_return_pct ?? 0) >= 0 ? "green" : "red"}
            />
            <SummaryCard
              label={L(labels, "studio_sharpe_ratio", "Sharpe Ratio")}
              value={(summary.sharpe_ratio ?? 0).toFixed(2)}
              color={(summary.sharpe_ratio ?? 0) >= 1 ? "green" : (summary.sharpe_ratio ?? 0) >= 0 ? "gray" : "red"}
            />
            <SummaryCard
              label={L(labels, "studio_max_dd", "Max Drawdown")}
              value={`${(summary.max_drawdown_pct ?? 0).toFixed(1)}%`}
              color="red"
            />
            <SummaryCard
              label={L(labels, "studio_win_rate", "Win Rate")}
              value={`${(summary.win_rate_pct ?? 0).toFixed(0)}%`}
              color={(summary.win_rate_pct ?? 0) >= 50 ? "green" : "red"}
            />
            <SummaryCard
              label={L(labels, "studio_vs_sp500", "vs S&P 500")}
              value={`${(summary.alpha_pct ?? 0) >= 0 ? "+" : ""}${(summary.alpha_pct ?? 0).toFixed(1)}%`}
              color={(summary.alpha_pct ?? 0) >= 0 ? "green" : "red"}
            />
            <SummaryCard
              label={L(labels, "studio_trades", "Total Trades")}
              value={String(summary.total_trades ?? 0)}
              color="gray"
            />
          </div>

          {/* Capital summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex items-center gap-8 text-sm">
            <div>
              <span className="text-gray-400">{L(labels, "studio_initial", "Initial Capital")}:</span>{" "}
              <span className="font-semibold">${(summary.initial_capital ?? 0).toLocaleString()}</span>
            </div>
            <div className="text-gray-300">&rarr;</div>
            <div>
              <span className="text-gray-400">{L(labels, "studio_final", "Final Capital")}:</span>{" "}
              <span className={`font-semibold ${(summary.final_capital ?? 0) >= (summary.initial_capital ?? 0) ? "text-green-600" : "text-red-500"}`}>
                ${(summary.final_capital ?? 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">{L(labels, "studio_benchmark", "Benchmark")} (S&P 500):</span>{" "}
              <span className="font-semibold">{(summary.benchmark_return_pct ?? 0).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-400">{L(labels, "studio_avg_trade", "Avg Trade")}:</span>{" "}
              <span className={`font-semibold ${(summary.avg_trade_return_pct ?? 0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                {(summary.avg_trade_return_pct ?? 0) >= 0 ? "+" : ""}{(summary.avg_trade_return_pct ?? 0).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-gray-100">
            {(["overview", "trades", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? "border-[#2e8b57] text-[#2e8b57]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "overview" ? L(labels, "studio_tab_overview", "Equity Curve")
                  : t === "trades" ? L(labels, "studio_tab_trades", "Trade Log")
                  : L(labels, "studio_tab_monthly", "Monthly Returns")}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "overview" && equityCurve.length > 1 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">{L(labels, "studio_equity_curve", "Equity Curve")}</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(d: string) => d.slice(5)}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio"]}
                    labelFormatter={(label: string) => label}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2e8b57"
                    strokeWidth={2}
                    dot={false}
                    name="Portfolio Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {tab === "trades" && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="px-4 py-3 text-left font-medium">{L(labels, "studio_ticker", "Ticker")}</th>
                      <th className="px-4 py-3 text-left font-medium">{L(labels, "studio_entry_date", "Entry")}</th>
                      <th className="px-4 py-3 text-right font-medium">{L(labels, "studio_entry_price", "Entry Price")}</th>
                      <th className="px-4 py-3 text-left font-medium">{L(labels, "studio_exit_date", "Exit")}</th>
                      <th className="px-4 py-3 text-right font-medium">{L(labels, "studio_exit_price", "Exit Price")}</th>
                      <th className="px-4 py-3 text-right font-medium">{L(labels, "studio_return_col", "Return")}</th>
                      <th className="px-4 py-3 text-left font-medium">{L(labels, "studio_signal", "Signal")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {trades.slice(0, 100).map((t, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{t.ticker}</td>
                        <td className="px-4 py-2 text-gray-500">{t.entry_date}</td>
                        <td className="px-4 py-2 text-right text-gray-700">${t.entry_price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-gray-500">{t.exit_date}</td>
                        <td className="px-4 py-2 text-right text-gray-700">${t.exit_price.toFixed(2)}</td>
                        <td className={`px-4 py-2 text-right font-semibold ${t.return_pct >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {t.return_pct >= 0 ? "+" : ""}{t.return_pct.toFixed(2)}%
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-400 max-w-[200px] truncate" title={t.exit_signal}>
                          {t.exit_signal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {trades.length > 100 && (
                <div className="px-4 py-3 text-sm text-gray-400 border-t border-gray-50">
                  Showing 100 of {trades.length} trades
                </div>
              )}
              {trades.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No trades recorded</div>
              )}
            </div>
          )}

          {tab === "monthly" && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">{L(labels, "studio_monthly_title", "Monthly Returns")}</h3>
              {monthlyReturns.length > 0 ? (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                  {monthlyReturns.map((m) => (
                    <div
                      key={m.month}
                      className={`text-center p-2 rounded-lg ${
                        m.return_pct >= 0 ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <div className="text-xs text-gray-400">{m.month}</div>
                      <div className={`text-sm font-bold ${m.return_pct >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {m.return_pct >= 0 ? "+" : ""}{m.return_pct.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400 text-center py-4">No monthly data available</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "green" | "red" | "gray";
}) {
  const colors = {
    green: "text-green-600",
    red: "text-red-500",
    gray: "text-gray-800",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-xl font-bold ${colors[color]}`}>{value}</div>
    </div>
  );
}
