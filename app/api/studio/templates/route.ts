/**
 * GET /api/studio/templates — pre-built strategy templates
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TEMPLATES = [
  {
    id: "momentum",
    name: "Momentum",
    description: "Buy when RSI > 50, price above 50-day EMA, and volume surge. Ride the trend.",
    strategy_type: "momentum",
    config: {
      entry_rules: [
        { indicator: "rsi", condition: "above", value: 50 },
        { indicator: "close", condition: "above", value: 0, _note: "price > EMA50 — evaluated dynamically" },
        { indicator: "vol_ratio_5", condition: "above", value: 1.5 },
      ],
      exit_rules: [
        { indicator: "rsi", condition: "below", value: 40 },
        { indicator: "stop_loss_pct", value: 5 },
        { indicator: "trailing_stop_pct", value: 3 },
      ],
      filters: { min_volume: 100000 },
      position_sizing: { method: "equal_weight", max_positions: 10, max_per_position_pct: 15 },
      backtest_params: { start_date: "2025-01-01", end_date: "2026-03-27", initial_capital: 100000, commission_pct: 0.1 },
    },
  },
  {
    id: "mean_reversion",
    name: "Mean Reversion",
    description: "Buy oversold stocks (RSI < 30) near Bollinger lower band with high volume. Sell when RSI normalises.",
    strategy_type: "mean_reversion",
    config: {
      entry_rules: [
        { indicator: "rsi", condition: "below", value: 30 },
        { indicator: "bb_pct", condition: "below", value: 0.2 },
        { indicator: "vol_ratio_5", condition: "above", value: 1.2 },
      ],
      exit_rules: [
        { indicator: "rsi", condition: "above", value: 60 },
        { indicator: "stop_loss_pct", value: 7 },
      ],
      filters: { min_volume: 50000 },
      position_sizing: { method: "equal_weight", max_positions: 10, max_per_position_pct: 15 },
      backtest_params: { start_date: "2025-01-01", end_date: "2026-03-27", initial_capital: 100000, commission_pct: 0.1 },
    },
  },
  {
    id: "breakout",
    name: "Breakout",
    description: "Buy on Bollinger Band breakout with volume confirmation. Capture explosive moves.",
    strategy_type: "breakout",
    config: {
      entry_rules: [
        { indicator: "bb_pct", condition: "above", value: 1.0 },
        { indicator: "vol_ratio_5", condition: "above", value: 2.0 },
        { indicator: "adx", condition: "above", value: 25 },
      ],
      exit_rules: [
        { indicator: "bb_pct", condition: "below", value: 0.5 },
        { indicator: "stop_loss_pct", value: 4 },
        { indicator: "trailing_stop_pct", value: 3 },
      ],
      filters: { min_volume: 100000 },
      position_sizing: { method: "equal_weight", max_positions: 8, max_per_position_pct: 15 },
      backtest_params: { start_date: "2025-01-01", end_date: "2026-03-27", initial_capital: 100000, commission_pct: 0.1 },
    },
  },
  {
    id: "trend_following",
    name: "Trend Following",
    description: "Enter on golden cross (EMA50 > EMA200) with positive MACD. Classic trend strategy.",
    strategy_type: "custom",
    config: {
      entry_rules: [
        { indicator: "sma_50_200", condition: "golden_cross" },
        { indicator: "macd_signal", condition: "crossover_up" },
      ],
      exit_rules: [
        { indicator: "sma_50_200", condition: "death_cross" },
        { indicator: "stop_loss_pct", value: 8 },
        { indicator: "trailing_stop_pct", value: 5 },
      ],
      filters: { min_volume: 100000 },
      position_sizing: { method: "equal_weight", max_positions: 10, max_per_position_pct: 15 },
      backtest_params: { start_date: "2025-01-01", end_date: "2026-03-27", initial_capital: 100000, commission_pct: 0.1 },
    },
  },
  {
    id: "stochastic_reversal",
    name: "Stochastic Reversal",
    description: "Buy when Stochastic K crosses above D in oversold territory. Quick reversal plays.",
    strategy_type: "mean_reversion",
    config: {
      entry_rules: [
        { indicator: "stoch_k", condition: "below", value: 20 },
        { indicator: "rsi", condition: "below", value: 40 },
      ],
      exit_rules: [
        { indicator: "stoch_k", condition: "above", value: 80 },
        { indicator: "stop_loss_pct", value: 5 },
      ],
      filters: { min_volume: 50000 },
      position_sizing: { method: "equal_weight", max_positions: 10, max_per_position_pct: 15 },
      backtest_params: { start_date: "2025-01-01", end_date: "2026-03-27", initial_capital: 100000, commission_pct: 0.1 },
    },
  },
];

export async function GET() {
  return NextResponse.json({ ok: true, templates: TEMPLATES });
}
