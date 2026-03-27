"use client";

/**
 * EarlySupporterBadge — gold/amber badge showing "Early Supporter #N"
 *
 * Compact, elegant pill that displays when a user has badge='early_supporter'.
 * i18n driven via labels passed from server component.
 */

interface Props {
  badgeNumber: number;
  /** Pre-rendered label like "Early Supporter #7" */
  label: string;
  /** Tooltip description */
  description?: string;
  /** Size variant */
  size?: "sm" | "md";
}

export default function EarlySupporterBadge({
  badgeNumber,
  label,
  description,
  size = "sm",
}: Props) {
  const isSm = size === "sm";

  return (
    <span
      title={description ?? label}
      className="inline-flex items-center gap-1 select-none"
      style={{
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        color: "#fff",
        padding: isSm ? "2px 10px" : "4px 14px",
        borderRadius: "100px",
        fontSize: isSm ? "11px" : "13px",
        fontWeight: 700,
        letterSpacing: "0.3px",
        lineHeight: 1.4,
        boxShadow: "0 1px 3px rgba(217, 119, 6, 0.3)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: isSm ? "10px" : "12px" }}>&#9733;</span>
      {label}
    </span>
  );
}
