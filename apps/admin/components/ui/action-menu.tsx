"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ActionMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

export function ActionMenu({ items }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "6px",
          borderRadius: "6px",
          border: "1px solid var(--admin-border-subtle)",
          background: "white",
          color: "var(--admin-text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "var(--admin-transition)",
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--admin-border)")}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--admin-border-subtle)")}
      >
        <MoreHorizontal size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              marginTop: "8px",
              width: "180px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid var(--admin-border)",
              boxShadow: "var(--admin-shadow-md)",
              zIndex: 50,
              padding: "4px",
              overflow: "hidden",
            }}
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  fontSize: "0.85rem",
                  color: item.variant === "danger" ? "var(--admin-danger)" : "var(--admin-text)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = item.variant === "danger" ? "#fff1f2" : "var(--admin-surface)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <item.icon size={14} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
