/**
 * lib/llm.ts  (V2.1)
 * Paid LLM integration (OpenAI / Gemini) for alert summarisation.
 * Private LLM stub demonstrates the enterprise data-separation story.
 *
 * Env vars:
 *   PAID_LLM_PROVIDER   = "openai" | "gemini"   (default: openai)
 *   PAID_LLM_API_KEY    = your key
 *   PRIVATE_LLM_ENABLED = "true" | "false"       (default: false)
 */

const PROVIDER = process.env.PAID_LLM_PROVIDER ?? "openai";
const LLM_API_KEY = process.env.PAID_LLM_API_KEY ?? "";
export const PRIVATE_LLM_ENABLED =
  process.env.PRIVATE_LLM_ENABLED === "true";

// ─── Paid LLM ─────────────────────────────────────────────────────────────

/**
 * Generate a structured, evidence-backed summary of detected page changes.
 * Returns null if no API key is configured (graceful degradation).
 *
 * Output format (v2.1):
 *   What changed:
 *   (one sentence)
 *
 *   Why it matters:
 *   (one sentence)
 *
 *   Evidence:
 *   • quote 1
 *   • quote 2
 */
export async function generatePaidSummary(
  ticker: string,
  snippet: string,
  evidenceQuotes: string[]
): Promise<string | null> {
  if (!LLM_API_KEY) return null;

  const quotesBlock =
    evidenceQuotes.length > 0
      ? evidenceQuotes.map((q, i) => `${i + 1}. "${q}"`).join("\n")
      : "(no direct quotes extracted)";

  const prompt = `You are a neutral financial data analyst. A web-monitoring tool detected wording changes on the investor-relations page of ${ticker}.

Changed text snippet:
${snippet.slice(0, 800)}

Evidence quotes from the changed text:
${quotesBlock}

Respond with EXACTLY this structure (no deviation):

What changed:
[One sentence describing the specific wording change detected.]

Why it matters:
[One neutral sentence about potential investor relevance. No financial advice.]

Evidence:
• [Direct quote from the changed text]
• [Another direct quote from the changed text]

Hard rules:
- Do NOT say "buy", "sell", "invest", or give any financial advice
- "What changed" and "Why it matters" must each be exactly one sentence
- Evidence bullets must be direct quotes from the evidence provided
- Total response MUST be under 120 words
- Be factual, neutral, and specific`;

  try {
    if (PROVIDER === "gemini") return await callGemini(prompt);
    return await callOpenAI(prompt);
  } catch (err) {
    console.error("[llm] paid summary error:", err);
    return null;
  }
}

async function callOpenAI(prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.2,
    }),
  });
  if (!res.ok)
    throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.choices[0].message.content as string).trim();
}

async function callGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${LLM_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 200, temperature: 0.2 },
    }),
  });
  if (!res.ok)
    throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (
    data.candidates[0].content.parts[0].text as string
  ).trim();
}

// ─── Private LLM stub ─────────────────────────────────────────────────────

/**
 * Enterprise story: sensitive signal routing to a private/self-hosted model.
 * Only receives pre-computed SCORES (never raw text) to protect sensitive data.
 */
export function getPrivateLLMNote(
  commitmentDelta: number,
  hedgingDelta: number,
  riskDelta: number,
  categories: string[]
): string | null {
  if (!PRIVATE_LLM_ENABLED) return null;

  const signals: string[] = [];
  if (riskDelta > 0.5) signals.push("elevated risk language detected");
  if (hedgingDelta > 0.5) signals.push("increased hedging frequency");
  if (commitmentDelta < -0.5) signals.push("reduced forward-guidance language");
  if (categories.includes("guidance_softening"))
    signals.push("potential guidance revision pattern");
  if (categories.includes("risk_increase"))
    signals.push("risk-factor emphasis increased");

  if (signals.length === 0)
    return "Private signal analysis: no notable pattern detected.";
  return `Private signal note (scores only, no raw text): ${signals.join("; ")}.`;
}
