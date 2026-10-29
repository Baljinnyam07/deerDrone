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
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        btnRef.current && !btnRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleScroll() { setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleToggle = () => {
    if (!isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        style={{
          padding: "7px",
          borderRadius: "999px",
          border: "1px solid var(--admin-border)",
          background: "var(--admin-card)",
          color: "var(--admin-text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "var(--admin-transition)",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "var(--admin-surface)")}
        onMouseOut={(e) => (e.currentTarget.style.background = "var(--admin-card)")}
      >
        <MoreHorizontal size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: coords.top,
              right: coords.right,
              width: "180px",
              backgroundColor: "var(--admin-card)",
              borderRadius: "12px",
              border: "1px solid var(--admin-border)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
              zIndex: 99999,
              padding: "4px",
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
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "transparent",
                  fontSize: "0.85rem",
                  color: item.variant === "danger" ? "var(--admin-danger)" : "var(--admin-text)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = item.variant === "danger" ? "rgba(239, 68, 68, 0.1)" : "var(--admin-surface)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <item.icon size={14} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
