"use client";

import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

interface StatusBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

// Tinted from one colour so the badge reads on both light and dark surfaces.
const tone = (color: string) => ({
  bg: `color-mix(in srgb, ${color} 14%, transparent)`,
  text: `color-mix(in srgb, ${color} 78%, var(--admin-text))`,
  dot: color,
});

const variants: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: tone("#10b981"),
  warning: tone("#f59e0b"),
  danger: tone("#ef4444"),
  info: tone("#0ea5e9"),
  neutral: tone("#94a3b8"),
  primary: tone("#1f7ae0"),
};

export function StatusBadge({ children, variant = "neutral" }: StatusBadgeProps) {
  const { bg, text, dot } = variants[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        borderRadius: "99px",
        fontSize: "0.75rem",
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
                whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "99px",
          backgroundColor: dot,
          display: "inline-block",
        }}
      />
      {children}
    </span>
  );
}
