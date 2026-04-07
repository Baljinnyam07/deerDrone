"use client";

import { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";

export interface FilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}

interface SearchFilterBarProps {
  onSearch?: (query: string) => void;
  onFiltersClick?: () => void;
  onSortChange?: (sortBy: string) => void;
  activeFilters?: FilterChip[];
  onClearAllFilters?: () => void;
  placeholder?: string;
}

export function SearchFilterBar({
  onSearch,
  onFiltersClick,
  onSortChange,
  activeFilters = [],
  onClearAllFilters,
  placeholder = "Хайлах...",
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingBottom: "16px",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {/* Search Input */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              color: "#94A3B8",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "100%",
              minHeight: "44px",
              paddingLeft: "40px",
              paddingRight: "12px",
              paddingTop: "10px",
              paddingBottom: "10px",
              fontSize: "0.9rem",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              fontFamily: "var(--font-body)",
              transition: "all 150ms ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2563EB";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(37, 99, 235, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              style={{
                position: "absolute",
                right: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94A3B8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              minHeight: "44px",
              padding: "10px 12px 10px 12px",
              fontSize: "0.9rem",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
              cursor: "pointer",
              appearance: "none",
              paddingRight: "32px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              color: "#475569",
              transition: "all 150ms ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2563EB";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(37, 99, 235, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <option value="popular">Алдартай</option>
            <option value="newest">Шинээр</option>
            <option value="price-low">Үнэ: Бага → Өндөр</option>
            <option value="price-high">Үнэ: Өндөр → Бага</option>
            <option value="rating">Үнэлгээ</option>
          </select>
          <ChevronDown
            size={18}
            style={{
              position: "absolute",
              right: "12px",
              pointerEvents: "none",
              color: "#94A3B8",
            }}
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={onFiltersClick}
          style={{
            minHeight: "44px",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            border: hasActiveFilters ? "none" : "1px solid #E2E8F0",
            borderRadius: "12px",
            backgroundColor: hasActiveFilters ? "#2563EB" : "#FFFFFF",
            color: hasActiveFilters ? "#FFFFFF" : "#475569",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 150ms ease",
            whiteSpace: "nowrap",
          }}
          className="filter-btn"
        >
          <span>Шүүлтүүр</span>
          {hasActiveFilters && (
            <span
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
          }}
        >
          {activeFilters.map((filter) => (
            <div
              key={filter.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: "#F1F5F9",
                borderRadius: "12px",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "#475569",
              }}
            >
              <span>{filter.label}</span>
              <button
                onClick={filter.onRemove}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0",
                  height: "16px",
                  width: "16px",
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {onClearAllFilters && (
            <button
              onClick={onClearAllFilters}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#2563EB",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Цэвэрлэх
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .filter-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
