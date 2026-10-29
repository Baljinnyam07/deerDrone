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
      borderRadius: "999px",
      border: "1px solid transparent",
      cursor: props.disabled || isLoading ? "not-allowed" : "pointer",
      opacity: props.disabled || isLoading ? 0.6 : 1,
      transition: "var(--admin-transition)",
      fontSize: size === "sm" ? "0.8rem" : "0.9rem",
      padding: size === "sm" ? "0 14px" : size === "lg" ? "0 28px" : "0 20px",
      minHeight: size === "sm" ? "34px" : size === "lg" ? "48px" : "40px",
      whiteSpace: "nowrap",
    };

    switch (variant) {
      case "primary":
        return { 
          ...baseStyles, 
          background: "var(--admin-primary)", 
          color: "white",
        };
      case "secondary":
        return { 
          ...baseStyles, 
          background: "var(--admin-card)", 
          color: "var(--admin-text)", 
          borderColor: "var(--admin-border)",
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
        };
      default:
        return baseStyles;
    }
  };

  // Omit motion-conflicting props from the spread to avoid TS errors
  const { onAnimationStart, onDragStart, onDragEnd, onDrag, ...safeProps } = props as any;

  return (
    <motion.button
      whileTap={!props.disabled && !isLoading ? { scale: 0.97 } : {}}
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
