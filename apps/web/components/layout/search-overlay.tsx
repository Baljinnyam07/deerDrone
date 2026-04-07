"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const suggestedQueries = [
  "Matrice",
  "Mavic",
  "Mini",
  "Thermal",
  "RTK",
  "Accessories",
];

export function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  function submitSearch(nextQuery: string) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    router.push(`/products?q=${encodeURIComponent(trimmedQuery)}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "80px",
            paddingLeft: "16px",
            paddingRight: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            zIndex: 10000,
            backdropFilter: "blur(40px)",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "none",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              color: "#0F172A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 250ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            type="button"
            aria-label="Close search"
          >
            <X size={28} />
          </button>

          {/* Search Container */}
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
            }}
          >
            {/* Search Form */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch(query);
              }}
              style={{
                position: "relative",
                marginBottom: "48px",
              }}
            >
              <input
                autoFocus
                type="text"
                placeholder="Дрон, сенсор, аксессуар хайх..."
                style={{
                  width: "100%",
                  padding: "16px 0 12px 0",
                  fontSize: "28px",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #0F172A",
                  color: "#0F172A",
                  outline: "none",
                  transition: "border-color 250ms",
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderBottomColor = "#0F172A")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                type="submit"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  padding: "8px",
                  cursor: "pointer",
                  color: "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={28} />
              </button>
            </form>

            {/* Search Suggestions */}
            <div>
              <h6
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "16px",
                }}
              >
                Санал болгох хайлтууд
              </h6>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {suggestedQueries.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => submitSearch(tag)}
                    type="button"
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#0F172A",
                      cursor: "pointer",
                      transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F0F4FF";
                      e.currentTarget.style.borderColor = "#2563EB";
                      e.currentTarget.style.color = "#2563EB";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F8FAFC";
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.color = "#0F172A";
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
