"use client";

interface ProductBadgeProps {
  type: "new" | "sale" | "best-seller" | "limited" | "stock";
  label?: string;
  discount?: number;
}

export function ProductBadge({ type, label, discount }: ProductBadgeProps) {
  const badgeConfig = {
    new: {
      bg: "rgba(16, 185, 129, 0.1)",
      color: "#10B981",
      defaultLabel: "NEW",
    },
    sale: {
      bg: "rgba(239, 68, 68, 0.1)",
      color: "#EF4444",
      defaultLabel: discount ? `-${discount}%` : "SALE",
    },
    "best-seller": {
      bg: "rgba(245, 158, 11, 0.1)",
      color: "#F59E0B",
      defaultLabel: "BEST SELLER",
    },
    limited: {
      bg: "rgba(239, 68, 68, 0.1)",
      color: "#EF4444",
      defaultLabel: "LIMITED",
    },
    stock: {
      bg: "rgba(16, 185, 129, 0.1)",
      color: "#10B981",
      defaultLabel: "IN STOCK",
    },
  };

  const config = badgeConfig[type];
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "12px",
        padding: "6px 12px",
        backgroundColor: config.bg,
        color: config.color,
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {displayLabel}
    </span>
  );
}
