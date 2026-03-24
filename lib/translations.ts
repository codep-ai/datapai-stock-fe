/**
 * lib/translations.ts  —  i18n types and helpers
 *
 * DB-driven translations are loaded via `lib/i18n.ts` (server-only).
 * This file exports the shared `Lang` type and a thin `t()` helper
 * for use in both server and client components.
 *
 * Server components:
 *   const labels = await loadTranslations(lang);  // from lib/i18n.ts
 *   labels["nav_usStocks"]
 *
 * Client components (receive labels as prop):
 *   t(labels, "nav_usStocks")
 */

/** Supported language codes */
export type Lang = "en" | "zh" | "zh-TW" | "ja" | "ko" | "vi" | "th" | "ms";

/** Flat dict of {label_key → translated text} */
export type Labels = Record<string, string>;

/** Lookup a label key from a pre-loaded labels dict.  Returns the key itself as fallback. */
export function t(labels: Labels, key: string): string {
  return labels[key] ?? key;
}

/** All supported lang codes (for validation) */
export const SUPPORTED_LANGS: Lang[] = ["en", "zh", "zh-TW", "ja", "ko", "vi", "th", "ms"];

/** Map of lang code → BCP 47 html lang attribute */
export const HTML_LANG: Record<Lang, string> = {
  en: "en",
  zh: "zh-CN",
  "zh-TW": "zh-TW",
  ja: "ja",
  ko: "ko",
  vi: "vi",
  th: "th",
  ms: "ms",
};
