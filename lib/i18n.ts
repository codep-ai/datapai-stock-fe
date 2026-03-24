/**
 * lib/i18n.ts  —  DB-driven internationalisation (server-only)
 *
 * Loads UI translations from `datapai.sys_lang_labels` and supported
 * languages from `datapai.sys_lang_supported`.
 *
 * Uses React `cache()` to deduplicate within a single server render,
 * plus Next.js `unstable_cache` for cross-request caching (5 min TTL).
 *
 * Usage in server components:
 *   const labels = await loadTranslations(lang);
 *   labels["nav_usStocks"]  // → "🇺🇸 Cổ phiếu Mỹ"
 */

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getPool } from "./db";

export type Labels = Record<string, string>;

export type SupportedLang = {
  lang: string;
  display_name: string;
  flag_emoji: string;
  is_active: boolean;
  sort_order: number;
};

// ── Translations ────────────────────────────────────────────────────────────

async function _fetchTranslations(lang: string): Promise<Labels> {
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT label_key, text FROM datapai.sys_lang_labels WHERE lang = $1",
    [lang],
  );
  const labels: Labels = {};
  for (const r of rows) labels[r.label_key] = r.text;

  // Fill gaps with English fallback
  if (lang !== "en") {
    const { rows: enRows } = await pool.query(
      "SELECT label_key, text FROM datapai.sys_lang_labels WHERE lang = 'en'",
    );
    for (const r of enRows) {
      if (!(r.label_key in labels)) labels[r.label_key] = r.text;
    }
  }
  return labels;
}

// unstable_cache: persists across requests (5 min revalidation)
const _cachedFetch = unstable_cache(_fetchTranslations, ["i18n-labels"], {
  revalidate: 300,
});

// React cache(): deduplicates within a single render tree
export const loadTranslations = cache(
  async (lang: string): Promise<Labels> => _cachedFetch(lang),
);

// ── Supported languages ─────────────────────────────────────────────────────

async function _fetchLanguages(): Promise<SupportedLang[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT lang, display_name, flag_emoji, is_active, sort_order
     FROM datapai.sys_lang_supported
     WHERE is_active = true
     ORDER BY sort_order`,
  );
  return rows as SupportedLang[];
}

const _cachedLangs = unstable_cache(_fetchLanguages, ["i18n-langs"], {
  revalidate: 300,
});

export const loadLanguages = cache(async (): Promise<SupportedLang[]> => _cachedLangs());
