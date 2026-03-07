import Link from "next/link";
import { getLatestAnalysesBySignalType } from "@/lib/db";
import { UNIVERSE } from "@/lib/universe";
import AlertsClient from "./AlertsClient";

export const dynamic = "force-dynamic";

export default function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  // Default to CONTENT_CHANGE only; pass "all" to see everything
  // This is resolved server-side via the URL param
  // We pass both datasets to the client component
  const contentOnly = getLatestAnalysesBySignalType("CONTENT_CHANGE", 100);
  const allSignals = getLatestAnalysesBySignalType(null, 100);
  const universe = Object.fromEntries(UNIVERSE.map((t) => [t.symbol, t.name]));

  void searchParams; // unused but part of page signature

  return (
    <AlertsClient
      contentOnly={contentOnly}
      allSignals={allSignals}
      universe={universe}
    />
  );
}
