"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Labels = Record<string, string>;
function L(labels: Labels, key: string, fallback: string): string {
  return labels[key] ?? fallback;
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Rule {
  indicator: string;
  condition: string;
  value?: number | string;
}

interface StrategyConfig {
  entry_rules: Rule[];
  exit_rules: Rule[];
  filters: {
    min_volume?: number;
    sectors?: string[];
  };
  position_sizing: {
    method: string;
    max_positions: number;
    max_per_position_pct: number;
  };
  backtest_params: {
    start_date: string;
    end_date: string;
    initial_capital: number;
    commission_pct: number;
  };
}

interface Template {
  id: string;
  name: string;
  description: string;
  strategy_type: string;
  config: StrategyConfig;
}

interface FeaturedStock {
  symbol: string;
  name: string;
}

// ── Indicator options ───────────────────────────────────────────────────────

const INDICATORS = [
  { value: "rsi", label: "RSI (14)" },
  { value: "macd_signal", label: "MACD Histogram" },
  { value: "ema_9", label: "EMA 9" },
  { value: "ema_20", label: "EMA 20" },
  { value: "ema_50", label: "EMA 50" },
  { value: "ema_200", label: "EMA 200" },
  { value: "bb_pct", label: "Bollinger %B" },
  { value: "bb_upper", label: "Bollinger Upper" },
  { value: "bb_lower", label: "Bollinger Lower" },
  { value: "stoch_k", label: "Stochastic %K" },
  { value: "stoch_d", label: "Stochastic %D" },
  { value: "adx", label: "ADX" },
  { value: "atr", label: "ATR" },
  { value: "vol_ratio_5", label: "Volume Ratio (5d)" },
  { value: "vol_ratio_10", label: "Volume Ratio (10d)" },
  { value: "close", label: "Price (Close)" },
  { value: "volume", label: "Volume" },
];

const CONDITIONS = [
  { value: "above", label: "Above" },
  { value: "below", label: "Below" },
  { value: "crosses_above", label: "Crosses Above" },
  { value: "crosses_below", label: "Crosses Below" },
  { value: "crossover_up", label: "Crossover Up" },
  { value: "crossover_down", label: "Crossover Down" },
  { value: "golden_cross", label: "Golden Cross (EMA50/200)" },
  { value: "death_cross", label: "Death Cross (EMA50/200)" },
];

const EXIT_INDICATORS = [
  ...INDICATORS,
  { value: "stop_loss_pct", label: "Stop Loss %" },
  { value: "trailing_stop_pct", label: "Trailing Stop %" },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function StrategyBuilderClient({
  labels,
  exchanges,
}: {
  labels: Labels;
  exchanges: string[];
}) {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exchange, setExchange] = useState(exchanges[0] ?? "US");
  const [tickerMode, setTickerMode] = useState<"featured" | "custom">("featured");
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [tickerInput, setTickerInput] = useState("");
  const [strategyType, setStrategyType] = useState("custom");

  // Entry/exit rules
  const [entryRules, setEntryRules] = useState<Rule[]>([
    { indicator: "rsi", condition: "below", value: 30 },
  ]);
  const [exitRules, setExitRules] = useState<Rule[]>([
    { indicator: "stop_loss_pct", condition: "", value: 5 },
  ]);

  // Filters
  const [minVolume, setMinVolume] = useState(100000);

  // Position sizing
  const [maxPositions, setMaxPositions] = useState(10);
  const [maxPerPosition, setMaxPerPosition] = useState(15);

  // Backtest params
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2026-03-27");
  const [initialCapital, setInitialCapital] = useState(100000);
  const [commissionPct, setCommissionPct] = useState(0.1);

  // Templates
  const [templates, setTemplates] = useState<Template[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Featured stocks for selected exchange
  const [featuredStocks, setFeaturedStocks] = useState<FeaturedStock[]>([]);

  // Load templates
  useEffect(() => {
    fetch("/api/studio/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates ?? []))
      .catch(() => {});
  }, []);

  // Load featured stocks when exchange changes
  useEffect(() => {
    fetch(`/api/stocks/active?exchange=${exchange}&featured=true&limit=50`)
      .then((r) => r.json())
      .then((d) => {
        const stocks = (d.stocks ?? d.data ?? []).map((s: { symbol?: string; ticker?: string; name?: string }) => ({
          symbol: s.symbol ?? s.ticker ?? "",
          name: s.name ?? "",
        }));
        setFeaturedStocks(stocks);
      })
      .catch(() => setFeaturedStocks([]));
  }, [exchange]);

  // Apply template
  const applyTemplate = useCallback((tpl: Template) => {
    setName(tpl.name);
    setDescription(tpl.description);
    setStrategyType(tpl.strategy_type);
    setEntryRules(tpl.config.entry_rules);
    setExitRules(tpl.config.exit_rules);
    if (tpl.config.filters?.min_volume) setMinVolume(tpl.config.filters.min_volume);
    if (tpl.config.position_sizing) {
      setMaxPositions(tpl.config.position_sizing.max_positions);
      setMaxPerPosition(tpl.config.position_sizing.max_per_position_pct);
    }
    if (tpl.config.backtest_params) {
      setStartDate(tpl.config.backtest_params.start_date);
      setEndDate(tpl.config.backtest_params.end_date);
      setInitialCapital(tpl.config.backtest_params.initial_capital);
      setCommissionPct(tpl.config.backtest_params.commission_pct);
    }
  }, []);

  // Add rule
  const addEntryRule = () => setEntryRules([...entryRules, { indicator: "rsi", condition: "above", value: 50 }]);
  const addExitRule = () => setExitRules([...exitRules, { indicator: "rsi", condition: "above", value: 70 }]);

  const removeEntryRule = (i: number) => setEntryRules(entryRules.filter((_, idx) => idx !== i));
  const removeExitRule = (i: number) => setExitRules(exitRules.filter((_, idx) => idx !== i));

  const updateEntryRule = (i: number, field: string, value: string | number) => {
    const updated = [...entryRules];
    updated[i] = { ...updated[i], [field]: value };
    setEntryRules(updated);
  };

  const updateExitRule = (i: number, field: string, value: string | number) => {
    const updated = [...exitRules];
    updated[i] = { ...updated[i], [field]: value };
    setExitRules(updated);
  };

  // Add ticker from input
  const addTicker = () => {
    const t = tickerInput.trim().toUpperCase();
    if (t && !selectedTickers.includes(t)) {
      setSelectedTickers([...selectedTickers, t]);
      setTickerInput("");
    }
  };

  // Toggle featured stock
  const toggleTicker = (sym: string) => {
    setSelectedTickers((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym].slice(0, 50),
    );
  };

  // Save strategy
  const handleSave = async () => {
    if (!name.trim()) {
      setError("Strategy name is required");
      return;
    }
    if (entryRules.length === 0) {
      setError("At least one entry rule is required");
      return;
    }

    setSaving(true);
    setError("");

    const config: StrategyConfig = {
      entry_rules: entryRules,
      exit_rules: exitRules,
      filters: { min_volume: minVolume },
      position_sizing: {
        method: "equal_weight",
        max_positions: maxPositions,
        max_per_position_pct: maxPerPosition,
      },
      backtest_params: {
        start_date: startDate,
        end_date: endDate,
        initial_capital: initialCapital,
        commission_pct: commissionPct,
      },
    };

    try {
      const res = await fetch("/api/studio/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          exchange,
          tickers: tickerMode === "featured" && selectedTickers.length === 0 ? "all_featured" : selectedTickers,
          strategy_type: strategyType,
          config,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create strategy");
        setSaving(false);
        return;
      }

      // Trigger backtest
      if (data.strategy?.id) {
        await fetch(`/api/studio/strategies/${data.strategy.id}/backtest`, { method: "POST" }).catch(() => {});
      }

      router.push("/studio");
    } catch (err) {
      setError("Network error");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <a href="/studio" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          &larr; {L(labels, "studio_back", "Back to Studio")}
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {L(labels, "studio_create_title", "Create Strategy")}
        </h1>
      </div>

      {/* Templates */}
      {templates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            {L(labels, "studio_templates", "Quick Start Templates")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => applyTemplate(tpl)}
                className="text-left bg-white border border-gray-100 rounded-lg p-3 hover:border-[#2e8b57] hover:shadow-sm transition-all"
              >
                <div className="font-medium text-sm text-gray-800">{tpl.name}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{tpl.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">{L(labels, "studio_basic_info", "Basic Info")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_name", "Strategy Name")} *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Momentum RSI"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57] focus:ring-1 focus:ring-[#2e8b57]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_type", "Strategy Type")}</label>
              <select
                value={strategyType}
                onChange={(e) => setStrategyType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              >
                <option value="custom">Custom</option>
                <option value="momentum">Momentum</option>
                <option value="mean_reversion">Mean Reversion</option>
                <option value="breakout">Breakout</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_description", "Description")}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Describe your strategy..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57] focus:ring-1 focus:ring-[#2e8b57]"
              />
            </div>
          </div>
        </section>

        {/* Exchange & Tickers */}
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">{L(labels, "studio_universe", "Universe")}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_exchange", "Exchange")}</label>
              <select
                value={exchange}
                onChange={(e) => { setExchange(e.target.value); setSelectedTickers([]); }}
                className="w-full md:w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              >
                {exchanges.map((ex) => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={tickerMode === "featured"}
                    onChange={() => setTickerMode("featured")}
                    className="accent-[#2e8b57]"
                  />
                  {L(labels, "studio_all_featured", "All Featured Stocks")}
                </label>
                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={tickerMode === "custom"}
                    onChange={() => setTickerMode("custom")}
                    className="accent-[#2e8b57]"
                  />
                  {L(labels, "studio_select_tickers", "Select Tickers")}
                </label>
              </div>

              {tickerMode === "custom" && (
                <div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tickerInput}
                      onChange={(e) => setTickerInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTicker()}
                      placeholder="Add ticker (e.g. AAPL)"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
                    />
                    <button
                      onClick={addTicker}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      {L(labels, "studio_add", "Add")}
                    </button>
                  </div>

                  {/* Selected tickers */}
                  {selectedTickers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {selectedTickers.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 bg-[#2e8b57]/10 text-[#2e8b57] text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {t}
                          <button onClick={() => toggleTicker(t)} className="hover:text-red-500">x</button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Featured stock pills */}
                  {featuredStocks.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-400 mb-1.5">{L(labels, "studio_click_to_add", "Click to add/remove:")}</div>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {featuredStocks.map((s) => (
                          <button
                            key={s.symbol}
                            onClick={() => toggleTicker(s.symbol)}
                            className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                              selectedTickers.includes(s.symbol)
                                ? "bg-[#2e8b57] text-white border-[#2e8b57]"
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#2e8b57]"
                            }`}
                            title={s.name}
                          >
                            {s.symbol}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Entry Rules */}
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">{L(labels, "studio_entry_rules", "Entry Rules")} <span className="text-xs text-gray-400 font-normal">(all must be true)</span></h2>
            <button
              onClick={addEntryRule}
              className="text-sm text-[#2e8b57] hover:text-[#247048] font-medium"
            >
              + {L(labels, "studio_add_rule", "Add Rule")}
            </button>
          </div>
          <div className="space-y-2">
            {entryRules.map((rule, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={rule.indicator}
                  onChange={(e) => updateEntryRule(i, "indicator", e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm flex-1 focus:outline-none focus:border-[#2e8b57]"
                >
                  {INDICATORS.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
                <select
                  value={rule.condition}
                  onChange={(e) => updateEntryRule(i, "condition", e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-36 focus:outline-none focus:border-[#2e8b57]"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {!["crossover_up", "crossover_down", "golden_cross", "death_cross"].includes(rule.condition) && (
                  <input
                    type="number"
                    value={rule.value ?? ""}
                    onChange={(e) => updateEntryRule(i, "value", parseFloat(e.target.value) || 0)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-24 focus:outline-none focus:border-[#2e8b57]"
                    placeholder="Value"
                  />
                )}
                <button
                  onClick={() => removeEntryRule(i)}
                  className="text-red-400 hover:text-red-600 text-sm px-1"
                  title="Remove"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Exit Rules */}
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">{L(labels, "studio_exit_rules", "Exit Rules")} <span className="text-xs text-gray-400 font-normal">(any one triggers exit)</span></h2>
            <button
              onClick={addExitRule}
              className="text-sm text-[#2e8b57] hover:text-[#247048] font-medium"
            >
              + {L(labels, "studio_add_rule", "Add Rule")}
            </button>
          </div>
          <div className="space-y-2">
            {exitRules.map((rule, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={rule.indicator}
                  onChange={(e) => updateExitRule(i, "indicator", e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm flex-1 focus:outline-none focus:border-[#2e8b57]"
                >
                  {EXIT_INDICATORS.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
                {!["stop_loss_pct", "trailing_stop_pct"].includes(rule.indicator) && (
                  <select
                    value={rule.condition}
                    onChange={(e) => updateExitRule(i, "condition", e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-36 focus:outline-none focus:border-[#2e8b57]"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                )}
                <input
                  type="number"
                  value={rule.value ?? ""}
                  onChange={(e) => updateExitRule(i, "value", parseFloat(e.target.value) || 0)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-24 focus:outline-none focus:border-[#2e8b57]"
                  placeholder={["stop_loss_pct", "trailing_stop_pct"].includes(rule.indicator) ? "%" : "Value"}
                />
                <button
                  onClick={() => removeExitRule(i)}
                  className="text-red-400 hover:text-red-600 text-sm px-1"
                  title="Remove"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Filters & Position Sizing */}
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">{L(labels, "studio_filters", "Filters & Sizing")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_min_volume", "Min Volume")}</label>
              <input
                type="number"
                value={minVolume}
                onChange={(e) => setMinVolume(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_max_positions", "Max Positions")}</label>
              <input
                type="number"
                value={maxPositions}
                onChange={(e) => setMaxPositions(parseInt(e.target.value) || 1)}
                min={1}
                max={50}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_max_per_pos", "Max % per Position")}</label>
              <input
                type="number"
                value={maxPerPosition}
                onChange={(e) => setMaxPerPosition(parseInt(e.target.value) || 5)}
                min={1}
                max={100}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              />
            </div>
          </div>
        </section>

        {/* Backtest Params */}
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">{L(labels, "studio_backtest_params", "Backtest Parameters")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_start_date", "Start Date")}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_end_date", "End Date")}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_capital", "Initial Capital")}</label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(parseInt(e.target.value) || 10000)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{L(labels, "studio_commission", "Commission %")}</label>
              <input
                type="number"
                step="0.01"
                value={commissionPct}
                onChange={(e) => setCommissionPct(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e8b57]"
              />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <a
            href="/studio"
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            {L(labels, "studio_cancel", "Cancel")}
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#2e8b57] text-white font-semibold rounded-lg hover:bg-[#247048] transition-colors disabled:opacity-50"
          >
            {saving
              ? L(labels, "studio_saving", "Saving...")
              : L(labels, "studio_save_run", "Save & Run Backtest")
            }
          </button>
        </div>
      </div>
    </div>
  );
}
