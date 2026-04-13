"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function AdminDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "500px",
}: AdminDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="admin-drawer-backdrop"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="admin-drawer-panel"
            style={{ maxWidth }}
          >
            {/* Header */}
            <div className="admin-drawer-header">
              <div>
                <h2 className="admin-drawer-title">{title}</h2>
                {description && <p className="admin-drawer-description">{description}</p>}
              </div>
              <button onClick={onClose} className="admin-drawer-close" aria-label="Close drawer">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="admin-drawer-body">{children}</div>

            {/* Footer */}
            {footer && <div className="admin-drawer-footer">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
