"use client";

/**
 * ConvertedPrice — shows price converted to the user's preferred currency.
 *
 * Reads the `lang` cookie to determine preferred currency, fetches FX rates
 * once (cached in module scope), and renders a small gray line like:
 *   ≈ ¥1,842 CNY
 *
 * If the user's preferred currency matches the exchange currency, renders nothing.
 *
 * Props:
 *   price     — the original price in the exchange's native currency
 *   exchange  — exchange code (US, ASX, HKEX, LSE, etc.)
 *   className — optional additional CSS classes
 */

import { useEffect, useState, memo } from "react";

// ── Currency mappings (must match lib/fx.ts) ─────────────────────────────────

const EXCHANGE_CURRENCY: Record<string, string> = {
  US: "USD", ASX: "AUD", HKEX: "HKD", HOSE: "VND",
  SET: "THB", KLSE: "MYR", IDX: "IDR", SSE: "CNY",
  SZSE: "CNY", LSE: "GBX", INDEX: "USD",
};

const LANG_CURRENCY: Record<string, string> = {
  en: "USD", zh: "CNY", "zh-TW": "CNY", ja: "JPY",
  ko: "KRW", vi: "VND", th: "THB", ms: "MYR",
};

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$", AUD: "A$", HKD: "HK$", VND: "₫", THB: "฿",
  MYR: "RM", IDR: "Rp", CNY: "¥", GBX: "p", GBP: "£",
  JPY: "¥", KRW: "₩",
};

const ZERO_DECIMAL = new Set(["VND", "JPY", "IDR", "KRW"]);

// ── Module-level FX rate cache ───────────────────────────────────────────────

type FxRateMap = Record<string, number>;

let _cachedRates: FxRateMap | null = null;
let _fetchPromise: Promise<FxRateMap> | null = null;

async function getFxRates(): Promise<FxRateMap> {
  if (_cachedRates) return _cachedRates;
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = fetch("/api/fx/rates")
    .then((r) => r.json())
    .then((data) => {
      _cachedRates = data.rates ?? { USD: 1 };
      // Refresh cache every 5 minutes
      setTimeout(() => { _cachedRates = null; _fetchPromise = null; }, 5 * 60 * 1000);
      return _cachedRates!;
    })
    .catch(() => {
      _fetchPromise = null;
      return { USD: 1 } as FxRateMap;
    });

  return _fetchPromise;
}

function getLangFromCookie(): string {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/);
  return match?.[1] ?? "en";
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  price: number;
  exchange: string;
  className?: string;
}

function ConvertedPriceInner({ price, exchange, className }: Props) {
  const [converted, setConverted] = useState<string | null>(null);

  useEffect(() => {
    const lang = getLangFromCookie();
    const userCurrency = LANG_CURRENCY[lang] ?? "USD";
    const exchangeCurrency = EXCHANGE_CURRENCY[exchange] ?? "USD";

    // Same currency — nothing to show
    if (userCurrency === exchangeCurrency) {
      setConverted(null);
      return;
    }

    getFxRates().then((rates) => {
      const fromRate = rates[exchangeCurrency];
      const toRate = rates[userCurrency];

      if (fromRate == null || toRate == null) {
        setConverted(null);
        return;
      }

      // Convert: price in exchangeCurrency → USD → userCurrency
      const inUsd = price / fromRate;
      const inTarget = inUsd * toRate;

      const decimals = ZERO_DECIMAL.has(userCurrency) ? 0 : 2;
      const symbol = CURRENCY_SYMBOL[userCurrency] ?? "";
      const formatted = inTarget.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      setConverted(`≈ ${symbol}${formatted} ${userCurrency}`);
    });
  }, [price, exchange]);

  if (!converted) return null;

  return (
    <span className={`text-xs text-gray-400 ${className ?? ""}`}>
      {converted}
    </span>
  );
}

const ConvertedPrice = memo(ConvertedPriceInner);
export default ConvertedPrice;
