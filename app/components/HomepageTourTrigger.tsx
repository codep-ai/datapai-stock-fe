"use client";

/**
 * HomepageTourTrigger — auto-starts the onboarding tour for first-time homepage visitors.
 *
 * Checks:
 *   1. Config flag `homepage_tour_enabled` (passed as prop from server)
 *   2. localStorage `datapai_tour_seen_homepage` — only triggers once
 *
 * To test repeatedly: clear localStorage or set config flag to "false" then "true".
 * To disable: UPDATE datapai.sys_common_config SET config_value = 'false'
 *             WHERE config_type = 'tour' AND config_key = 'homepage_tour_enabled';
 */

import { useEffect } from "react";

const STORAGE_KEY = "datapai_tour_seen_homepage";

interface Props {
  enabled: boolean;
}

export default function HomepageTourTrigger({ enabled }: Props) {
  useEffect(() => {
    if (!enabled) return;

    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;

    // Mark as seen immediately so it won't re-trigger on page refresh
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());

    // Small delay to let page render, then click the tour trigger
    const timer = setTimeout(() => {
      const tourBtn = document.querySelector<HTMLElement>("[data-start-tour]");
      if (tourBtn) tourBtn.click();
    }, 1500);

    return () => clearTimeout(timer);
  }, [enabled]);

  return null;
}
