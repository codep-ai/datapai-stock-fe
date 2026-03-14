/**
 * GET  /api/profile   — fetch current user's investor profile
 * PUT  /api/profile   — upsert investor profile (partial updates accepted)
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getInvestorProfileOrDefault, upsertInvestorProfile, type ProfileUpdate } from "@/lib/investorProfile";

export const dynamic = "force-dynamic";

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getInvestorProfileOrDefault(user.userId);
  return NextResponse.json({ ok: true, profile });
}

// ── PUT ──────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProfileUpdate = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Sanitise — strip any fields that aren't real profile fields
  const allowed: (keyof ProfileUpdate)[] = [
    "risk_tolerance", "investment_horizon", "strategies",
    "preferred_exchanges", "preferred_sectors", "excluded_sectors",
    "portfolio_size", "portfolio_tickers",
    "analysis_preference", "preferred_lang",
    "response_style", "show_risk_warnings", "esg_only", "tax_context",
    "screener_defaults", "onboarding_completed", "onboarding_step",
  ];
  const sanitised: ProfileUpdate = {};
  for (const key of allowed) {
    if (key in body) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sanitised as any)[key] = (body as any)[key];
    }
  }

  const profile = await upsertInvestorProfile(user.userId, sanitised);
  return NextResponse.json({ ok: true, profile });
}
