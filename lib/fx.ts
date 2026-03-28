/**
 * lib/fx.ts  —  Exchange rate helpers
 *
 * Server-side: fetches latest FX rates from datapai.fx_rates_daily
 * Client-side: currency formatting + lang→currency mapping
 */

import { getPool } from "./db";

// ── Types ────────────────────────────────────────────────────────────────────

export interface FxRate {
  base_currency: string;
  quote_currency: string;
  rate: number;
  trade_date: string;
  source: string;
}

export interface FxRateMap {
  [currency: string]: number; // 1 USD = X currency
}

// ── Exchange → Currency mapping ──────────────────────────────────────────────

export const EXCHANGE_CURRENCY: Record<string, string> = {
  US:   "USD",
  ASX:  "AUD",
  HKEX: "HKD",
  HOSE: "VND",
  SET:  "THB",
  KLSE: "MYR",
  IDX:  "IDR",
  SSE:  "CNY",
  SZSE: "CNY",
  LSE:  "GBX",
};

export const EXCHANGE_CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$",
  AUD: "A$",
  HKD: "HK$",
  VND: "₫",
  THB: "฿",
  MYR: "RM",
  IDR: "Rp",
  CNY: "¥",
  GBX: "p",
  GBP: "£",
  JPY: "¥",
  KRW: "₩",
};

// ── Lang → preferred currency ────────────────────────────────────────────────

export const LANG_CURRENCY: Record<string, string> = {
  en:      "USD",
  "zh":    "CNY",
  "zh-TW": "CNY",
  ja:      "JPY",
  ko:      "KRW",
  vi:      "VND",
  th:      "THB",
  ms:      "MYR",
};

// ── Decimal places per currency ──────────────────────────────────────────────

const ZERO_DECIMAL_CURRENCIES = new Set(["VND", "JPY", "IDR", "KRW"]);

export function getCurrencyDecimals(currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2;
}

// ── Server-side: fetch latest rates from DB ──────────────────────────────────

export async function getLatestFxRates(): Promise<FxRate[]> {
  const pool = getPool();
  const { rows } = await pool.query(`
    SELECT DISTINCT ON (quote_currency)
           base_currency, quote_currency, rate, trade_date, source
    FROM datapai.fx_rates_daily
    WHERE base_currency = 'USD'
    ORDER BY quote_currency, trade_date DESC
  `);
  return rows.map((r: Record<string, unknown>) => ({
    base_currency: r.base_currency as string,
    quote_currency: r.quote_currency as string,
    rate: Number(r.rate),
    trade_date: r.trade_date as string,
    source: r.source as string,
  }));
}

export async function getLatestFxRateMap(): Promise<FxRateMap> {
  const rates = await getLatestFxRates();
  const map: FxRateMap = { USD: 1.0 };
  for (const r of rates) {
    map[r.quote_currency] = r.rate;
  }
  return map;
}

// ── Conversion helper ────────────────────────────────────────────────────────

export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: FxRateMap
): number | null {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (fromRate == null || toRate == null) return null;

  // Convert: amount in FROM → USD → TO
  // amount_usd = amount / fromRate (since 1 USD = fromRate units of FROM)
  // amount_to  = amount_usd * toRate
  return (amount / fromRate) * toRate;
}

// ── Format converted price ───────────────────────────────────────────────────

export function formatConvertedPrice(
  amount: number,
  currency: string
): string {
  const decimals = getCurrencyDecimals(currency);
  const symbol = EXCHANGE_CURRENCY_SYMBOL[currency] ?? currency;
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol}${formatted} ${currency}`;
}
