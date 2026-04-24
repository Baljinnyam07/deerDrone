"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { searchProducts, type SearchResult } from "@/lib/actions";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const runSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    const data = await searchProducts(q);
    setResults(data);
    setSelected(0);
    setHasSearched(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 280);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  const navigate = (slug: string) => {
    router.push(`/products/${slug}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].slug);
    }
  };

  const showEmpty = hasSearched && !loading && results.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
        paddingLeft: "16px",
        paddingRight: "16px",
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "100%",
          maxWidth: "620px",
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        }}
      >
        {/* ── Input row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0 16px",
            borderBottom: results.length > 0 || showEmpty ? "1px solid #F1F5F9" : "none",
          }}
        >
          {loading ? (
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid #2563EB",
                borderTopColor: "transparent",
                flexShrink: 0,
                animation: "spin 0.6s linear infinite",
              }}
            />
          ) : (
            <Search size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Бүтээгдэхүүн хайх..."
            style={{
              flex: 1,
              padding: "18px 0",
              fontSize: "15px",
              fontWeight: 500,
              color: "#0F172A",
              background: "transparent",
              border: "none",
              outline: "none",
            }}
          />
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              padding: "6px",
              cursor: "pointer",
              color: "#94A3B8",
              borderRadius: "8px",
              transition: "color 150ms",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0F172A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
            aria-label="Хаах"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {results.length > 0 && (
            <motion.ul
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              style={{ maxHeight: "62vh", overflowY: "auto", margin: 0, padding: 0, listStyle: "none" }}
            >
              {results.map((r, i) => (
                <li key={r.id} style={{ borderBottom: i < results.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                  <button
                    onClick={() => navigate(r.slug)}
                    onMouseEnter={() => setSelected(i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 16px",
                      textAlign: "left",
                      background: selected === i ? "#F8FAFC" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 120ms",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        position: "relative",
                        width: "52px",
                        height: "52px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#F1F5F9",
                      }}
                    >
                      {r.imageUrl && (
                        <Image
                          src={r.imageUrl}
                          alt={r.name}
                          fill
                          sizes="52px"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: "9px",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#2563EB",
                          marginBottom: "3px",
                        }}
                      >
                        {r.categoryName}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "#0F172A",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {r.name}
                      </p>
                      {r.shortDescription && (
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: "11.5px",
                            color: "#94A3B8",
                            lineHeight: 1.4,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {r.shortDescription}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={selected === i ? "#2563EB" : "#CBD5E1"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, transition: "stroke 120ms" }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}

          {showEmpty && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: "32px 16px", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}
            >
              <span style={{ display: "block", fontSize: "28px", marginBottom: "8px" }}>🔍</span>
              &ldquo;{query}&rdquo; — бүтээгдэхүүн олдсонгүй
            </motion.div>
          )}
        </AnimatePresence>

        {/* spinner keyframe */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </motion.div>
  );
}
