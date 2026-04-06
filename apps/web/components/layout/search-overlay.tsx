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
          className="search-overlay position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center pt-5 px-4"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            zIndex: 10000,
            backdropFilter: "blur(40px)",
          }}
        >
          <button
            onClick={onClose}
            className="btn btn-link position-absolute top-0 end-0 m-4 p-2 text-dark"
            type="button"
          >
            <X size={32} />
          </button>

          <div className="container" style={{ maxWidth: "800px", marginTop: "10vh" }}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch(query);
              }}
              className="position-relative mb-5"
            >
              <input
                autoFocus
                type="text"
                placeholder="Search drones, payloads, accessories..."
                className="form-control form-control-lg border-0 border-bottom rounded-0 px-0 pb-3 fs-2 fw-medium"
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  borderBottomColor: "#000 !important",
                }}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                type="submit"
                className="btn btn-link position-absolute end-0 top-0 p-0 text-dark"
              >
                <Search size={32} />
              </button>
            </form>

            <div className="search-suggestions">
              <h6 className="text-secondary small fw-bold mb-4">Санал болгох хайлтууд</h6>
              <div className="d-flex flex-wrap gap-2">
                {suggestedQueries.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => submitSearch(tag)}
                    type="button"
                    className="btn btn-light rounded-pill px-4 py-2 small fw-medium transition-all hover-scale"
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
