"use client";

import { useRef, useEffect } from "react";
import type { Product } from "@deer-drone/types";
import { PremiumProductCard } from "..";

interface Props {
  products: Product[];
  badges: Record<number, "new" | "sale" | "best-seller" | undefined>;
  discounts: Record<number, number | undefined>;
}

export function ProductsMobileScroll({ products, badges, discounts }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || window.innerWidth > 768) return;

    const id = setTimeout(() => {
      el.scrollTo({ left: 80, behavior: "smooth" });
      const id2 = setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 650);
      return () => clearTimeout(id2);
    }, 700);

    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <style>{mobileStyles}</style>

      {/* Desktop: normal grid */}
      <div className="pmg-desktop">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className="p-card-shell p-card-anim"
            style={{ animationDelay: `${(idx % 12) * 0.04}s` }}
          >
            <PremiumProductCard
              product={product}
              badge={badges[idx]}
              discount={discounts[idx]}
              rating={Number((4.2 + (idx % 5) * 0.16).toFixed(1))}
              reviewCount={20 + (idx % 8) * 19}
            />
          </div>
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="pmg-mobile-wrap">
        <div className="pmg-mobile-track" ref={trackRef}>
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="pmg-mobile-card p-card-anim"
              style={{ animationDelay: `${(idx % 12) * 0.05}s` }}
            >
              <PremiumProductCard
                product={product}
                badge={badges[idx]}
                discount={discounts[idx]}
                rating={Number((4.2 + (idx % 5) * 0.16).toFixed(1))}
                reviewCount={20 + (idx % 8) * 19}
              />
            </div>
          ))}
        </div>

        {/* Right fade gradient — scroll hint indicator */}
        <div className="pmg-fade-right" />
      </div>
    </>
  );
}

const mobileStyles = `
  /* Desktop grid */
  .pmg-desktop {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    align-items: stretch;
  }

  /* Mobile scroll — hidden on desktop */
  .pmg-mobile-wrap { display: none; position: relative; }

  @media (max-width: 768px) {
    .pmg-desktop { display: none; }
    .pmg-mobile-wrap { display: block; }

    .pmg-mobile-track {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 4px 0 16px;
      -webkit-overflow-scrolling: touch;
    }
    .pmg-mobile-track::-webkit-scrollbar { display: none; }

    .pmg-mobile-card {
      flex: 0 0 calc(50vw - 22px);
      scroll-snap-align: start;
      display: flex;
      min-width: 0;
    }
    .pmg-mobile-card > * { width: 100%; }

    /* Right fade — hints more content */
    .pmg-fade-right {
      position: absolute;
      top: 0;
      right: 0;
      width: 48px;
      height: calc(100% - 16px);
      background: linear-gradient(to left, rgba(248,250,252,0.95) 0%, transparent 100%);
      pointer-events: none;
    }
  }

  @media (max-width: 480px) {
    .pmg-mobile-card {
      flex: 0 0 calc(72vw - 16px);
    }
  }
`;
