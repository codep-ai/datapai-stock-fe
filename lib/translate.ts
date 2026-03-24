/**
 * lib/translate.ts — On-demand content translation via Gemini with DB caching
 *
 * Used for translating AI-generated content (signal summaries, FA analysis, etc.)
 * that is stored in English in the DB.
 *
 * Flow: check cache → if miss, call Gemini → store in cache → return translated text
 */

import { getPool } from "./db";
import { createHash } from "crypto";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY ?? "";
const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const LANG_NAMES: Record<string, string> = {
  zh: "Simplified Chinese",
  "zh-TW": "Traditional Chinese",
  ja: "Japanese",
  ko: "Korean",
  vi: "Vietnamese",
  th: "Thai",
  ms: "Malay",
};

function md5(text: string): string {
  return createHash("md5").update(text).digest("hex");
}

/**
 * Translate a text string to the target language.
 * Uses DB cache (content_translation_cache) to avoid re-translating.
 *
 * @param text - English source text
 * @param lang - Target language code (e.g. "zh", "vi")
 * @param sourceTable - Cache key part (e.g. "analyses")
 * @param sourceId - Cache key part (e.g. analysis row ID)
 * @param fieldName - Cache key part (e.g. "agent_what_changed")
 * @returns Translated text, or original if lang=en or translation fails
 */
export async function translateContent(
  text: string | null | undefined,
  lang: string,
  sourceTable: string,
  sourceId: string,
  fieldName: string,
): Promise<string> {
  if (!text || lang === "en" || !LANG_NAMES[lang]) return text ?? "";

  const hash = md5(text);
  const pool = getPool();

  // 1. Check cache
  const cached = await pool.query(
    `SELECT translated FROM datapai.content_translation_cache
     WHERE source_table=$1 AND source_id=$2 AND field_name=$3 AND lang=$4 AND source_hash=$5`,
    [sourceTable, sourceId, fieldName, lang, hash],
  );
  if (cached.rows[0]) return cached.rows[0].translated;

  // 2. Call Gemini
  const langName = LANG_NAMES[lang];
  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Translate to ${langName}. Be concise — shorten sentences, keep key points only. Keep numbers, %, tickers as-is. Output ONLY translated text.\n\n${text}` }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      console.warn(`[translate] Gemini HTTP ${res.status} for ${sourceTable}/${sourceId}/${fieldName}`);
      return text;
    }

    const json = await res.json();
    const translated = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!translated) return text;

    // 3. Cache result
    await pool.query(
      `INSERT INTO datapai.content_translation_cache (source_table, source_id, field_name, lang, source_hash, translated)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (source_table, source_id, field_name, lang)
       DO UPDATE SET translated=$6, source_hash=$5, created_at=NOW()`,
      [sourceTable, sourceId, fieldName, lang, hash, translated],
    );

    return translated;
  } catch (err) {
    console.warn(`[translate] Error translating ${sourceTable}/${sourceId}/${fieldName}:`, err);
    return text;
  }
}

/**
 * Batch-translate multiple fields for one source record.
 * Returns a map of {fieldName: translatedText}.
 */
export async function translateFields(
  fields: Record<string, string | null | undefined>,
  lang: string,
  sourceTable: string,
  sourceId: string,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (lang === "en") {
    for (const [k, v] of Object.entries(fields)) result[k] = v ?? "";
    return result;
  }

  // Run all translations in parallel
  const entries = Object.entries(fields);
  const translations = await Promise.all(
    entries.map(([field, text]) =>
      translateContent(text, lang, sourceTable, sourceId, field),
    ),
  );

  for (let i = 0; i < entries.length; i++) {
    result[entries[i][0]] = translations[i];
  }
  return result;
}
