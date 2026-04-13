"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  children: ReactNode;
}

export function AdminButton({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading,
  children,
  ...props
}: AdminButtonProps) {
  const getStyles = () => {
    const baseStyles: any = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontWeight: 600,
      borderRadius: "var(--admin-radius-sm)",
      border: "1px solid transparent",
      cursor: props.disabled || isLoading ? "not-allowed" : "pointer",
      opacity: props.disabled || isLoading ? 0.6 : 1,
      transition: "var(--admin-transition)",
      fontSize: size === "sm" ? "0.8rem" : "0.875rem",
      padding: size === "sm" ? "6px 12px" : size === "lg" ? "12px 24px" : "8px 16px",
      minHeight: size === "sm" ? "32px" : size === "lg" ? "48px" : "38px",
    };

    switch (variant) {
      case "primary":
        return { 
          ...baseStyles, 
          background: "var(--admin-primary)", 
          color: "white",
          boxShadow: "0 1px 3px rgba(37, 99, 235, 0.2)",
        };
      case "secondary":
        return { 
          ...baseStyles, 
          background: "var(--admin-card)", 
          color: "var(--admin-text)", 
          borderColor: "var(--admin-border)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
        };
      case "outline":
        return { 
          ...baseStyles, 
          background: "transparent", 
          color: "var(--admin-primary)", 
          borderColor: "var(--admin-primary)",
        };
      case "ghost":
        return { ...baseStyles, background: "transparent", color: "var(--admin-text-secondary)" };
      case "danger":
        return { 
          ...baseStyles, 
          background: "var(--admin-danger)", 
          color: "white",
          boxShadow: "0 1px 3px rgba(239, 68, 68, 0.2)",
        };
      default:
        return baseStyles;
    }
  };

  // Omit motion-conflicting props from the spread to avoid TS errors
  const { onAnimationStart, onDragStart, onDragEnd, onDrag, ...safeProps } = props as any;

  return (
    <motion.button
      whileHover={!props.disabled && !isLoading ? { scale: 1.01, translateY: -1 } : {}}
      whileTap={!props.disabled && !isLoading ? { scale: 0.98 } : {}}
      style={getStyles()}
      {...safeProps}
    >
      {isLoading ? (
        <span className="animate-spin" style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%" }} />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : 16} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 14 : 18} />}
        </>
      )}
    </motion.button>
  );
}
