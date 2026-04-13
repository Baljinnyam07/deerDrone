"use client";

import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

interface StatusBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: { bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
  warning: { bg: "#fffbe3", text: "#92400e", dot: "#f59e0b" },
  danger: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  info: { bg: "#f0f9ff", text: "#075985", dot: "#0ea5e9" },
  neutral: { bg: "#f8fafc", text: "#475569", dot: "#94a3b8" },
  primary: { bg: "#eff6ff", text: "#1e40af", dot: "#2563eb" },
};

export function StatusBadge({ children, variant = "neutral" }: StatusBadgeProps) {
  const { bg, text, dot } = variants[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "2px 10px",
        borderRadius: "99px",
        fontSize: "0.75rem",
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
        border: `1px solid ${bg === "#ffffff" ? "var(--admin-border)" : "transparent"}`,
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
