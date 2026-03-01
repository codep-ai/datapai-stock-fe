"use client";

import { useState } from "react";
import Link from "next/link";
import { UNIVERSE } from "@/lib/universe";

export default function Home() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleRun() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/run", { method: "POST" });
      const data = await res.json();
      const ok = data.results?.filter((r: { status: string }) => r.status === "ok").length ?? 0;
      const err = data.results?.filter((r: { status: string }) => r.status === "error").length ?? 0;
      setResult(`Done. ${ok} succeeded, ${err} failed.`);
    } catch (e) {
      setResult(`Error: ${String(e)}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      {/* ── Full-width green gradient hero — datap.ai signature style ── */}
      <div
        className="w-full px-6 pt-14 pb-14 text-center"
        style={{ background: "linear-gradient(45deg, seagreen, darkseagreen)" }}
      >
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Yellow pill badge — matching datap.ai's #f9b116 CTA highlight */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{ background: "#f9b116", color: "#252525" }}>
            <span className="w-2 h-2 rounded-full bg-[#252525]/40 animate-pulse inline-block" />
            DataPAI &nbsp;·&nbsp; powered by TinyFish &amp; ag2
          </div>

          <h1 className="text-4xl font-bold text-white drop-shadow-sm">
            Stock Website Change Radar
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Monitors IR/News pages of 20 US small-cap companies. Detects wording
            shifts, scores language changes, and surfaces alerts with stock price context.
          </p>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/alerts"
              className="bg-white text-brand font-semibold px-6 py-2.5 rounded-lg hover:bg-white/90 transition-colors shadow-sm"
            >
              View Alerts →
            </Link>
            <button
              onClick={handleRun}
              disabled={running}
              className="border border-white/60 text-white hover:bg-white/10 px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {running ? "Fetching pages…" : "Run Scan Now"}
            </button>
          </div>

          {result && <p className="text-white/90 text-sm">{result}</p>}

          {/* Partner logos strip inside hero */}
          <div className="flex items-center justify-center gap-4 pt-4 opacity-80">
            <span className="text-white/60 text-xs uppercase tracking-widest">Powered by</span>
            <span className="bg-white/95 rounded-md px-3 py-1 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/tinyfish-logo.svg" alt="TinyFish" style={{ height: "20px", width: "auto" }} />
            </span>
            <span className="text-white/50 text-sm">&amp;</span>
            <span className="bg-white/95 rounded-md px-3 py-1 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ag2-logo.png" alt="ag2" style={{ height: "20px", width: "auto" }} />
            </span>
          </div>

        </div>
      </div>

      {/* ── Constrained content below the hero ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1", label: "Fetch", desc: "TinyFish renders JS-heavy IR pages in a real browser" },
            { step: "2", label: "Store", desc: "Daily snapshots stored in SQLite with content hashing" },
            { step: "3", label: "Diff", desc: "Text diff detects added/removed language" },
            { step: "4", label: "Score", desc: "Commitment, hedging, and risk word shifts computed" },
          ].map((item) => (
            <div key={item.step} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-brand font-bold text-2xl mb-2">{item.step}</div>
              <div className="text-[#252525] font-semibold mb-1">{item.label}</div>
              <div className="text-gray-500 text-sm">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Universe */}
        <div>
          <h2 className="text-xl font-semibold text-[#252525] mb-4">Monitored Universe</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {UNIVERSE.map((t) => (
              <Link
                key={t.symbol}
                href={`/ticker/${t.symbol}`}
                className="bg-white border border-gray-200 hover:border-brand rounded-lg px-4 py-3 transition-colors group shadow-sm"
              >
                <div className="text-brand font-bold group-hover:text-brand-light">{t.symbol}</div>
                <div className="text-gray-400 text-xs mt-0.5 truncate">{t.name}</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
