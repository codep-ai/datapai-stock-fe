import { NextResponse } from "next/server";
import crypto from "crypto";
import { UNIVERSE, type TickerInfo } from "@/lib/universe";
import { fetchPageText } from "@/lib/tinyfish";
import {
  insertSnapshot,
  insertAlert,
  getPreviousSnapshot,
} from "@/lib/db";
import { diffTexts } from "@/lib/diff";
import { computeScoreDeltas } from "@/lib/score";

const CONCURRENCY = 5; // parallel TinyFish calls

type TickerResult = { ticker: string; status: string; error?: string };

async function processTicker(ticker: TickerInfo): Promise<TickerResult> {
  try {
    const { text } = await fetchPageText(ticker.url);
    const hash = crypto.createHash("sha256").update(text).digest("hex");
    const now = new Date().toISOString();

    const insertedId = insertSnapshot({
      ticker: ticker.symbol,
      url: ticker.url,
      fetched_at: now,
      content_hash: hash,
      text,
    });

    const prev = getPreviousSnapshot(ticker.symbol, insertedId);

    if (prev) {
      const diff = diffTexts(prev.text, text);
      const scores = computeScoreDeltas(prev.text, text);

      insertAlert({
        ticker: ticker.symbol,
        computed_at: now,
        percent_changed: diff.percentChanged,
        added_lines: diff.addedLines,
        removed_lines: diff.removedLines,
        snippet: diff.snippet,
        ...scores,
      });
    }

    return { ticker: ticker.symbol, status: "ok" };
  } catch (err) {
    return { ticker: ticker.symbol, status: "error", error: String(err) };
  }
}

/** Run an array of async tasks with limited concurrency */
async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  let i = 0;

  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
}

export const maxDuration = 300; // allow up to 5 min for full scan

export async function POST() {
  const tasks = UNIVERSE.map((ticker) => () => processTicker(ticker));
  const results = await pLimit(tasks, CONCURRENCY);

  const ok = results.filter((r) => r.status === "ok").length;
  const errors = results.filter((r) => r.status === "error").length;

  return NextResponse.json({ ok: true, succeeded: ok, failed: errors, results });
}
