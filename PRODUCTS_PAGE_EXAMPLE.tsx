/**
 * PRODUCTS PAGE TEMPLATE — Example Implementation
 *
 * This is a reference implementation showing how to integrate all premium components
 * into a complete product listing page.
 *
 * Location: apps/web/app/(store)/products/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import {
  PremiumProductCard,
  CategoryTabs,
  SearchFilterBar,
  FilterOverlay,
  RatingStars,
  SkeletonCard,
} from "@/components";
import type { Product } from "@deer-drone/types";
import type { Category, FilterGroup } from "@/components";

// Mock data - replace with actual Supabase queries
const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Бүхэлдээ",
    slug: "all",
    icon: "🚁",
    count: 48,
  },
  {
    id: "2",
    name: "Мэргэжлийн",
    slug: "professional",
    icon: "🏢",
    count: 12,
  },
  {
    id: "3",
    name: "Бүтээчид",
    slug: "creator",
    icon: "📸",
    count: 18,
  },
  {
    id: "4",
    name: "Эхлэгчид",
    slug: "beginner",
    icon: "🎓",
    count: 10,
  },
  {
    id: "5",
    name: "Эдлэл",
    slug: "accessories",
    icon: "⚙️",
    count: 8,
  },
];

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "brand",
    title: "Үйлдвэрлэгч",
    type: "checkbox",
    options: [
      { id: "dji", label: "DJI", checked: false },
      { id: "parrot", label: "Parrot", checked: false },
      { id: "auterls", label: "Auterls", checked: false },
    ],
  },
  {
    id: "price",
    title: "Үнэ",
    type: "range",
    min: 500000,
    max: 15000000,
  },
  {
    id: "features",
    title: "Үндсэн функц",
    type: "checkbox",
    options: [
      { id: "4k-camera", label: "4K Камер", checked: false },
      { id: "long-battery", label: "Урт батерей", checked: false },
      { id: "foldable", label: "Нугалагдах", checked: false },
      { id: "gps", label: "GPS", checked: false },
    ],
  },
  {
    id: "rating",
    title: "Үнэлгээ",
    type: "checkbox",
    options: [
      { id: "5-stars", label: "⭐⭐⭐⭐⭐ (5 одоо)", checked: false },
      { id: "4-stars", label: "⭐⭐⭐⭐ (4+ одоо)", checked: false },
      { id: "3-stars", label: "⭐⭐⭐ (3+ одоо)", checked: false },
    ],
  },
];

export default function ProductsPage() {
  // State Management
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    Array<{ id: string; label: string }>
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  // Fetch products (mock data for now)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
        id: `product-${i}`,
        name: `DJI Air ${i % 3} Pro`,
        slug: `dji-air-${i}-pro`,
        categoryName: MOCK_CATEGORIES[Math.floor(Math.random() * 4) + 1].name,
        price: 3000000 + Math.random() * 10000000,
        shortDescription: "Advanced camera and flight capabilities",
        images: [{ url: "/assets/drone-product.png" }],
      })) as Product[];

      setProducts(mockProducts);
      setIsLoading(false);
    }, 800);
  }, [activeCategory]);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.id.localeCompare(a.id);
        case "price-low":
          return (a.price as number) - (b.price as number);
        case "price-high":
          return (b.price as number) - (a.price as number);
        case "rating":
          return 4.5 - 4;
        case "popular":
        default:
          return 0;
      }
    });

  const handleWishlistToggle = (productId: string) => {
    const newWishlisted = new Set(wishlisted);
    if (newWishlisted.has(productId)) {
      newWishlisted.delete(productId);
    } else {
      newWishlisted.add(productId);
    }
    setWishlisted(newWishlisted);
  };

  const handleRemoveFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter((f) => f.id !== filterId));
  };

  return (
    <main style={{ paddingTop: "64px" }}>
      {/* Page Header */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 32px 32px",
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: "8px",
            lineHeight: 1.2,
          }}
        >
          Дрон каталог
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#475569",
            margin: 0,
          }}
        >
          {filteredProducts.length} үр дүн ·{" "}
          {activeCategory === "all" ? "Бүхэл каталог" : activeCategory}
        </p>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px 24px",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <CategoryTabs
          categories={MOCK_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          showCount={true}
        />
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 32px",
        }}
      >
        <SearchFilterBar
          onSearch={setSearchQuery}
          onFiltersClick={() => setFilterOverlayOpen(true)}
          onSortChange={setSortBy}
          activeFilters={activeFilters.map((f) => ({
            ...f,
            onRemove: () => handleRemoveFilter(f.id),
          }))}
          onClearAllFilters={() => setActiveFilters([])}
          placeholder="Дроны нэрээр хайх..."
        />
      </div>

      {/* Products Grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
          className="products-grid"
        >
          {isLoading ? (
            // Loading skeleton cards
            Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))
          ) : filteredProducts.length > 0 ? (
            // Product cards
            filteredProducts.map((product, idx) => {
              const badges = [
                idx === 0 ? "new" : idx === 1 ? "best-seller" : null,
              ].filter(Boolean) as any[];
              const badge = badges[0];

              return (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  badge={badge}
                  discount={badge === "sale" ? 20 : undefined}
                  rating={4.5 - Math.random()}
                  reviewCount={Math.floor(Math.random() * 100) + 10}
                  isWishlisted={wishlisted.has(product.id)}
                  onWishlistToggle={() => handleWishlistToggle(product.id)}
                />
              );
            })
          ) : (
            // Empty state
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
              }}
            >
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#475569",
                  marginBottom: "12px",
                }}
              >
                Хайлтын үр дүн олдсонгүй
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#94A3B8",
                }}
              >
                Өөр хайлт эсвэл шүүлтүүр оролдоно уу
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filter Overlay (Mobile) */}
      <FilterOverlay
        isOpen={filterOverlayOpen}
        onClose={() => setFilterOverlayOpen(false)}
        filterGroups={FILTER_GROUPS}
        onApply={(filters) => {
          console.log("Filters applied:", filters);
          setFilterOverlayOpen(false);
        }}
      />

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(
              auto-fill,
              minmax(160px, 1fr)
            ) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </main>
  );
}
