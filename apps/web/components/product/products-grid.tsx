"use client";

import { useState, useTransition, useRef } from "react";
import type { Product } from "@deer-drone/types";
import { PremiumProductCard } from "./premium-product-card";
import { SkeletonCard } from "../ui/skeleton-card";
import { PAGE_SIZE, type SortOption } from "../../lib/products-config";

interface ProductsGridProps {
  initialProducts: Product[];
  categorySlug?: string;
  brand?: string;
  search?: string;
  sort?: SortOption;
}

export function ProductsGrid({
  initialProducts,
  categorySlug,
  brand,
  search,
  sort,
}: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialProducts.length >= PAGE_SIZE);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const animateFromRef = useRef(initialProducts.length);

  function loadMore() {
    const currentCount = products.length;
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (brand)        params.set("brand", brand);
    if (search)       params.set("q", search);
    if (sort)         params.set("sort", sort);
    params.set("limit",  String(PAGE_SIZE));
    params.set("offset", String(currentCount));

    setFetchError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/v1/products?${params}`);
        if (!res.ok) throw new Error("Серверээс хариу ирсэнгүй");
        const json = await res.json() as { items: Product[] };
        const next = json.items ?? [];
        animateFromRef.current = currentCount;
        setProducts(prev => [...prev, ...next]);
        setHasMore(next.length >= PAGE_SIZE);
      } catch {
        setFetchError("Бүтээгдэхүүн татахад алдаа гарлаа. Дахин оролдоно уу.");
      }
    });
  }

  if (products.length === 0 && !isPending) {
    return <div className="p-empty"><p>Үр дүн олдсонгүй</p></div>;
  }

  return (
    <>
      <div className="p-grid">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className={`p-card-shell${idx >= animateFromRef.current ? " p-card-anim" : ""}`}
            style={idx >= animateFromRef.current
              ? { animationDelay: `${(idx - animateFromRef.current) * 0.04}s` }
              : undefined}
          >
            <PremiumProductCard
              product={product}
              badge={idx === 0 ? "new" : idx === 1 ? "best-seller" : undefined}
              discount={idx === 2 ? 15 : undefined}
              rating={Number((4.2 + (idx % 5) * 0.16).toFixed(1))}
              reviewCount={20 + (idx % 8) * 19}
            />
          </div>
        ))}

        {isPending && Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={`sk-${i}`} className="p-card-shell">
            <SkeletonCard />
          </div>
        ))}
      </div>

      {fetchError && (
        <div className="pg-error">
          <span>{fetchError}</span>
          <button className="pg-retry" onClick={loadMore}>Дахин оролдох</button>
        </div>
      )}

      {!fetchError && (hasMore || isPending) && (
        <div className="pg-wrap">
          <button className="pg-btn" onClick={loadMore} disabled={isPending}>
            {isPending
              ? <><span className="pg-spin" /> Уншиж байна...</>
              : <>Цааш үзэх <span className="pg-arrow">↓</span></>}
          </button>
        </div>
      )}

      <style>{`
        .pg-wrap {
          display: flex;
          justify-content: center;
          margin-top: 48px;
        }
        .pg-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 36px;
          height: 50px;
          border-radius: 999px;
          border: 1.5px solid #0f172a;
          background: #fff;
          color: #0f172a;
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 160ms, color 160ms, transform 140ms;
        }
        .pg-btn:hover:not(:disabled) {
          background: #0f172a;
          color: #fff;
          transform: translateY(-2px);
        }
        .pg-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .pg-arrow { font-size: 1rem; }
        .pg-spin {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: pg-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes pg-spin { to { transform: rotate(360deg); } }
        .pg-error {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
          padding: 16px 24px;
          border-radius: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          font-size: 0.9rem;
        }
        .pg-retry {
          padding: 6px 16px;
          border-radius: 8px;
          border: 1px solid #f87171;
          background: #fff;
          color: #dc2626;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .pg-retry:hover { background: #fef2f2; }
      `}</style>
    </>
  );
}
