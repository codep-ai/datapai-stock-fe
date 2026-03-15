"use client";

/**
 * OnboardingBanner — dismissible top-of-page nudge for users who
 * haven't yet completed the 7-step investor profile wizard.
 *
 * Shown:  when logged in AND onboarding_completed = false
 * Hidden: when user clicks "×" (stored in sessionStorage so it
 *         re-appears on the next browser session, but doesn't pester
 *         every click within the same tab session)
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  onboardingDone: boolean;
}

const DISMISS_KEY = "datapai_onboarding_banner_dismissed";

export default function OnboardingBanner({ onboardingDone }: Props) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!onboardingDone) {
      // Show unless dismissed in this session
      const dismissed = sessionStorage.getItem(DISMISS_KEY);
      setVisible(!dismissed);
    }
  }, [onboardingDone]);

  if (!visible) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div
      className="w-full flex items-center justify-between gap-4 px-6 py-3 text-sm font-medium"
      style={{ background: "#fff7ed", borderBottom: "1px solid #fed7aa" }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-xl flex-shrink-0">🎯</span>
        <p className="text-orange-800 truncate">
          <strong>Set up your investor profile</strong> — 7 quick questions so AI never asks your
          risk tolerance, strategy or horizon again.
          <span className="ml-2 text-orange-600">Takes 90 seconds.</span>
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => router.push("/profile/onboarding")}
          className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:brightness-110"
          style={{ background: "#f97316" }}
        >
          Get started →
        </button>
        <button
          onClick={dismiss}
          className="text-orange-400 hover:text-orange-700 transition-colors text-lg leading-none"
          title="Dismiss"
          aria-label="Dismiss onboarding banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
