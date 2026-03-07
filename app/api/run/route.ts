/**
 * POST /api/run  (V2.1)
 * Non-blocking: creates run immediately, returns {runId}.
 * Scan runs asynchronously in background — no permission loops.
 * Client polls GET /api/run/:id for status.
 *
 * Features:
 *   - PENDING → RUNNING → SUCCESS/FAILED lifecycle
 *   - Per-ticker scan_events step log
 *   - Signal type classification (CONTENT_CHANGE / ARCHIVE_CHANGE / LAYOUT_CHANGE)
 */

import crypto from "crypto";
import { NextResponse } from "next/server";
import { UNIVERSE, type TickerInfo } from "@/lib/universe";
import { fetchPageText } from "@/lib/tinyfish";
import { cleanText } from "@/lib/clean";
import { checkQuality, passesQualityGate } from "@/lib/quality";
import { diffTexts } from "@/lib/diff";
import { computeScoreDeltas } from "@/lib/score";
import { generatePaidSummary, getPrivateLLMNote, PRIVATE_LLM_ENABLED } from "@/lib/llm";
import {
  insertRun,
  startRun,
  finishRun,
  failRun,
  insertSnapshot,
  getPreviousSnapshot,
  insertDiff,
  insertAnalysis,
  insertScanEvent,
  getDb,
} from "@/lib/db";

export const maxDuration = 300;

// ─── Signal type classification ────────────────────────────────────────────

function classifySignal(
  addedLineTexts: string[],
  changedPct: number,
  riskDelta: number
): "CONTENT_CHANGE" | "ARCHIVE_CHANGE" | "LAYOUT_CHANGE" {
  const archiveKeywords = ["date:", "headline:", "press_release:", "posted:", "published:"];
  const archiveMatches = addedLineTexts.filter((line) => {
    const lower = line.toLowerCase();
    return archiveKeywords.some((kw) => lower.includes(kw));
  });
  if (archiveMatches.length >= 2 || archiveMatches.length / Math.max(addedLineTexts.length, 1) > 0.4) {
    return "ARCHIVE_CHANGE";
  }
  if (changedPct > 80 && riskDelta === 0) {
    return "LAYOUT_CHANGE";
  }
  return "CONTENT_CHANGE";
}

// ─── Log scan step ─────────────────────────────────────────────────────────

function logStep(runId: string, ticker: string, step: string, status: "start" | "done" | "error", message?: string) {
  try {
    insertScanEvent({
      id: crypto.randomUUID(),
      run_id: runId,
      ticker,
      step,
      status,
      message: message ?? null,
      created_at: new Date().toISOString(),
    });
  } catch { /* best-effort */ }
}

// ─── Ticker processor ─────────────────────────────────────────────────────

async function processTicker(
  t: TickerInfo,
  runId: string
): Promise<{ changed: boolean; alerted: boolean; failed: boolean }> {
  try {
    // Step 1: Fetch
    logStep(runId, t.symbol, "Fetching page", "start");
    const { text, title, finalUrl, tinyfishRunRef } = await fetchPageText(t.url);
    logStep(runId, t.symbol, "Fetching page", "done");
    const now = new Date().toISOString();

    // Step 2: Extracting / cleaning
    logStep(runId, t.symbol, "Extracting content", "start");
    const cleaned = cleanText(text);
    logStep(runId, t.symbol, "Extracting content", "done");

    // Step 3: Quality check
    logStep(runId, t.symbol, "Cleaning text", "start");
    const quality = checkQuality(cleaned);
    const snapId = crypto.randomUUID();
    logStep(runId, t.symbol, "Cleaning text", "done");

    insertSnapshot({
      id: snapId,
      run_id: runId,
      ticker: t.symbol,
      url: t.url,
      fetched_at: now,
      final_url: finalUrl ?? null,
      title: title ?? null,
      text,
      cleaned_text: cleaned,
      content_hash: crypto.createHash("sha256").update(cleaned).digest("hex"),
      word_count: quality.word_count,
      extractor: "tinyfish",
      quality_flags_json: JSON.stringify(quality.flags),
    });

    if (tinyfishRunRef) {
      try {
        getDb()
          .prepare("UPDATE runs SET tinyfish_run_ref=? WHERE id=? AND tinyfish_run_ref IS NULL")
          .run(tinyfishRunRef, runId);
      } catch {}
    }

    const prev = getPreviousSnapshot(t.symbol, snapId);
    if (!prev) {
      return { changed: false, alerted: false, failed: false };
    }

    // Step 4: Diff
    logStep(runId, t.symbol, "Computing diff", "start");
    const diff = diffTexts(prev.cleaned_text, cleaned);
    const diffId = crypto.randomUUID();
    insertDiff({
      id: diffId,
      snapshot_new_id: snapId,
      snapshot_old_id: prev.id,
      similarity: diff.similarity,
      changed_pct: diff.changed_pct,
      added_lines: diff.added_lines,
      removed_lines: diff.removed_lines,
      snippet: diff.snippet,
    });
    logStep(runId, t.symbol, "Computing diff", "done", `${diff.changed_pct.toFixed(1)}% changed`);

    if (diff.changed_pct < 1 && diff.added_lines === 0) {
      return { changed: false, alerted: false, failed: false };
    }

    // Step 5: Score
    const scores = computeScoreDeltas(
      prev.cleaned_text,
      cleaned,
      diff.added_line_texts
    );

    // Classify signal type
    const signalType = classifySignal(diff.added_line_texts, diff.changed_pct, scores.risk_delta);

    // Step 6: AI analysis
    logStep(runId, t.symbol, "Running AI analysis", "start");
    let llmSummaryPaid: string | null = null;
    if (passesQualityGate(quality) && scores.evidence_quotes.length > 0) {
      llmSummaryPaid = await generatePaidSummary(
        t.symbol,
        diff.snippet,
        scores.evidence_quotes
      );
    }

    const llmSummaryPrivate = PRIVATE_LLM_ENABLED
      ? getPrivateLLMNote(
          scores.commitment_delta,
          scores.hedging_delta,
          scores.risk_delta,
          scores.categories
        )
      : null;
    logStep(runId, t.symbol, "Running AI analysis", "done");

    const analysisId = crypto.randomUUID();
    insertAnalysis({
      id: analysisId,
      snapshot_new_id: snapId,
      diff_id: diffId,
      commitment_delta: scores.commitment_delta,
      hedging_delta: scores.hedging_delta,
      risk_delta: scores.risk_delta,
      alert_score: scores.alert_score,
      confidence: quality.confidence,
      categories_json: JSON.stringify(scores.categories),
      llm_summary_paid: llmSummaryPaid,
      llm_summary_private: llmSummaryPrivate,
      reasoning_evidence_json: JSON.stringify(scores.evidence_quotes),
      signal_type: signalType,
    });

    return { changed: true, alerted: true, failed: false };
  } catch (err) {
    logStep(runId, t.symbol, "Processing", "error", String(err).slice(0, 120));
    return { changed: false, alerted: false, failed: true };
  }
}

// ─── Background scan ──────────────────────────────────────────────────────

async function runScanAsync(runId: string) {
  try {
    startRun(runId);

    const CONCURRENCY = 3;
    const queue = [...UNIVERSE];
    let scanned = 0, changed = 0, alerted = 0, failed = 0;

    async function worker() {
      while (queue.length > 0) {
        const ticker = queue.shift();
        if (!ticker) break;
        const result = await processTicker(ticker, runId);
        scanned++;
        if (result.changed) changed++;
        if (result.alerted) alerted++;
        if (result.failed) failed++;
        // Update completed_count in real-time for polling
        try {
          getDb()
            .prepare("UPDATE runs SET completed_count=?, scanned_count=? WHERE id=?")
            .run(scanned, scanned, runId);
        } catch {}
      }
    }

    const workers = Array.from(
      { length: Math.min(CONCURRENCY, UNIVERSE.length) },
      worker
    );
    await Promise.all(workers);

    finishRun(runId, new Date().toISOString(), {
      scanned,
      changed,
      alerts: alerted,
      failed,
    });
  } catch (err) {
    failRun(runId, new Date().toISOString(), String(err).slice(0, 200));
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────

export async function POST() {
  const runId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  insertRun(runId, startedAt, UNIVERSE.length);

  // Fire and forget — scan runs in background on persistent Node.js server
  runScanAsync(runId).catch((err) => {
    console.error("[run] background scan error:", err);
  });

  return NextResponse.json({ runId });
}
