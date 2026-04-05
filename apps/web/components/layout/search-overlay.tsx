"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="search-overlay position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center pt-5 px-4"
          style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.98)", 
            zIndex: 10000,
            backdropFilter: "blur(40px)"
          }}
        >
          <button 
            onClick={onClose} 
            className="btn btn-link position-absolute top-0 end-0 m-4 p-2 text-dark"
          >
            <X size={32} />
          </button>

          <div className="container" style={{ maxWidth: "800px", marginTop: "10vh" }}>
            <form onSubmit={handleSearch} className="position-relative mb-5">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="form-control form-control-lg border-0 border-bottom rounded-0 px-0 pb-3 fs-2 fw-medium"
                style={{ 
                  backgroundColor: "transparent", 
                  boxShadow: "none",
                  borderBottomColor: "#000 !important"
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-link position-absolute end-0 top-0 p-0 text-dark"
              >
                <Search size={32} />
              </button>
            </form>

            <div className="search-suggestions">
              <h6 className="text-secondary small fw-bold mb-4">ХАЙХ ҮГС</h6>
              <div className="d-flex flex-wrap gap-2">
                {["Mavic 3 Pro", "Mini 4 Pro", "Air 3", "Action 4", "RS 3 Pro", "Pocket 3"].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => { setQuery(tag); router.push(`/products?search=${tag}`); onClose(); }}
                    className="btn btn-light rounded-pill px-4 py-2 small fw-medium transition-all hover-scale"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
