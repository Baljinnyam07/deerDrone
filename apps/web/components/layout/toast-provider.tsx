"use client";

import { useToastStore } from "../../store/toast";
import type { ToastType } from "../../store/toast";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue" />;
    }
  };

  return (
    <div className="toast-container fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto flex items-center gap-3 bg-white border border-line rounded-xl px-4 py-3 shadow-lg w-auto max-w-sm"
          >
            {getIcon(toast.type)}
            <span className="text-sm font-medium text-text flex-1">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted hover:text-text transition-colors p-1 rounded-full hover:bg-surface-soft"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
