"use client";

import { useState } from "react";
import Link from "next/link";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categorySlug: string) => void;
  showCount?: boolean;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  showCount = false,
}: CategoryTabsProps) {
  const [active, setActive] = useState(activeCategory || categories[0]?.slug);

  const handleCategoryClick = (slug: string) => {
    setActive(slug);
    onCategoryChange?.(slug);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        overflowY: "hidden",
        paddingBottom: "8px",
        scrollBehavior: "smooth",
      }}
      className="category-tabs-container"
    >
      {categories.map((category) => {
        const isActive = active === category.slug;

        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: isActive ? "#2563EB" : "#FFFFFF",
              color: isActive ? "#FFFFFF" : "#475569",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
              whiteSpace: "nowrap",
              boxShadow: isActive
                ? "0 4px 6px -1px rgba(37, 99, 235, 0.1)"
                : "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
              border: isActive ? "none" : "1px solid #E2E8F0",
            }}
            className="category-tab"
          >
            {category.icon && (
              <span style={{ fontSize: "1.1rem" }}>{category.icon}</span>
            )}
            <span>{category.name}</span>
            {showCount && category.count && (
              <span
                style={{
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.2)"
                    : "#F1F5F9",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {category.count}
              </span>
            )}
          </button>
        );
      })}

      <style jsx>{`
        .category-tabs-container {
          -webkit-overflow-scrolling: touch;
        }

        .category-tab:hover {
          transform: ${activeCategory === "slug" ? "none" : "translateY(-2px)"};
        }

        @media (max-width: 640px) {
          .category-tabs-container {
            gap: "6px";
          }

          .category-tab {
            padding: 8px 16px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
