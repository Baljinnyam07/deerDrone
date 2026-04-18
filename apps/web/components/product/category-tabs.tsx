"use client";

import React from "react";
import Link from "next/link";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: React.ReactNode;
  count?: number;
  href?: string;
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
  const renderTabContent = (category: Category, isActive: boolean) => (
    <div className="tab-wrapper">
      <span className="tab-text">{category.name}</span>
      <div className="tab-underline" />
    </div>
  );

  return (
    <div className="tech-tabs-shell">
      <div className="tech-tabs-container">
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          const className = `tech-tab ${isActive ? "active" : ""}`;

          if (category.href) {
            return (
              <Link
                key={category.id}
                href={category.href}
                className={className}
              >
                {renderTabContent(category, isActive)}
              </Link>
            );
          }

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange?.(category.slug)}
              className={className}
            >
              {renderTabContent(category, isActive)}
            </button>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tech-tabs-shell {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 20px 0 40px;
          border-bottom: 1px solid #f0f0f0;
        }

        .tech-tabs-container {
          display: flex;
          gap: 32px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 0 10px;
        }

        .tech-tabs-container::-webkit-scrollbar {
          display: none;
        }

        .tech-tab {
          position: relative;
          background: none;
          border: none;
          padding: 8px 0 12px;
          cursor: pointer;
          text-decoration: none;
          color: #666666;
          transition: all 0.25s ease;
          outline: none;
          white-space: nowrap;
        }

        .tab-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .tab-text {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .tab-underline {
          position: absolute;
          bottom: -13px; /* Align with container bottom border */
          left: 0;
          width: 0;
          height: 3px;
          background: #009b72; /* The specific teal/green from screenshot */
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          border-radius: 4px 4px 0 0;
        }

        .tech-tab:hover {
          color: #000000;
        }

        .tech-tab.active {
          color: #009b72;
        }

        .tech-tab.active .tab-underline {
          width: 100%;
        }

        @media (max-width: 768px) {
          .tech-tabs-container {
            gap: 20px;
            justify-content: flex-start;
          }
          .tab-text { font-size: 0.8rem; }
        }
      ` }} />
    </div>
  );
}