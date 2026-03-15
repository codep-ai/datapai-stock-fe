"use client";

/**
 * ProfileBadge — compact nav indicator showing the user's risk level.
 * Clicking it navigates to /profile.
 *
 * States:
 *   - onboarding not done → pulsing orange dot "Set up profile"
 *   - onboarding done → coloured risk badge (AGGRESSIVE / MODERATE / etc.)
 */

import { useRouter } from "next/navigation";

const RISK_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  CONSERVATIVE: { label: "Conservative", bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  MODERATE:     { label: "Moderate",     bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  AGGRESSIVE:   { label: "Aggressive",   bg: "#fff7ed", text: "#9a3412", dot: "#f97316" },
  SPECULATIVE:  { label: "Speculative",  bg: "#fdf4ff", text: "#7e22ce", dot: "#a855f7" },
};

interface Props {
  riskTolerance:  string | null;
  onboardingDone: boolean;
}

export default function ProfileBadge({ riskTolerance, onboardingDone }: Props) {
  const router = useRouter();

  // Not set up yet → pulsing prompt
  if (!onboardingDone || !riskTolerance) {
    return (
      <button
        onClick={() => router.push("/profile/onboarding")}
        title="Set up your investor profile"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-95"
        style={{ background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "#f97316" }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#f97316" }} />
        </span>
        Set up profile
      </button>
    );
  }

  const cfg = RISK_CONFIG[riskTolerance] ?? RISK_CONFIG["MODERATE"];

  return (
    <button
      onClick={() => router.push("/profile")}
      title={`Your profile: ${cfg.label} — click to edit`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-95"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.dot}40` }}
    >
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </button>
  );
}
