"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMoney } from "@deer-drone/utils";
import Image from "next/image";

export function MinimalProductCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <div style={{ position: "relative", padding: "0 20px", margin: "0 -20px" }}>
      <style dangerouslySetInnerHTML={{ __html: carouselStyles }} />

      {/* Scroll track */}
      <div className="mc-track" ref={scrollRef}>
        {products.map((product, idx) => (
          <Link
            key={`${product.id}-${idx}`}
            href={product.slug ? `/products/${product.slug}` : "#"}
            className="mc-card"
          >
            {/* Image */}
            <div className="mc-img-wrap">
              {product.brand && (
                <span className="mc-brand-chip">{product.brand}</span>
              )}
              <Image
                src={product.images?.[0]?.url || product.image || "/assets/drone-product.png"}
                alt={product.name}
                fill
                style={{ objectFit: "contain", padding: "12px" }}
                className="mc-img"
              />
            </div>

            {/* Content */}
            <div className="mc-content">
              <p className="mc-name">{product.name}</p>
              <div className="mc-price-row">
                <span className="mc-price">{formatMoney(product.price)}</span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="mc-compare">{formatMoney(product.comparePrice)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Arrows */}
      {products.length > 3 && (
        <>
          <button className="mc-arrow mc-arrow-left" onClick={() => scroll("left")} aria-label="Өмнөх">
            <ChevronLeft size={18} />
          </button>
          <button className="mc-arrow mc-arrow-right" onClick={() => scroll("right")} aria-label="Дараах">
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

const carouselStyles = `
  .mc-track {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 4px 2px 12px;
  }
  .mc-track::-webkit-scrollbar { display: none; }

  .mc-card {
    flex: 0 0 220px;
    scroll-snap-align: start;
    text-decoration: none;
    background: #fff;
    border-radius: 14px;
    border: 1.5px solid #F1F5F9;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 220ms cubic-bezier(0.4,0,0.2,1),
                box-shadow 220ms cubic-bezier(0.4,0,0.2,1),
                border-color 220ms;
  }
  .mc-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(15,23,42,0.09);
    border-color: #CBD5E1;
  }
  .mc-card:hover .mc-img {
    transform: scale(1.05);
  }

  .mc-img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: #F8FAFC;
    overflow: hidden;
  }
  .mc-img {
    transition: transform 250ms cubic-bezier(0.4,0,0.2,1) !important;
  }
  .mc-brand-chip {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    background: rgba(15,23,42,0.82);
    color: #fff;
    padding: 3px 8px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
  }

  .mc-content {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  .mc-name {
    margin: 0;
    font-size: 0.88rem;
    font-weight: 600;
    color: #0F172A;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .mc-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: auto;
  }
  .mc-price {
    font-size: 1rem;
    font-weight: 700;
    color: #0F172A;
    letter-spacing: -0.02em;
  }
  .mc-compare {
    font-size: 0.8rem;
    color: #94A3B8;
    text-decoration: line-through;
  }

  /* Arrows */
  .mc-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-60%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid #E2E8F0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(15,23,42,0.1);
    transition: background 150ms, box-shadow 150ms, transform 150ms;
    z-index: 5;
    color: #0F172A;
  }
  .mc-arrow:hover {
    background: #0F172A;
    color: #fff;
    border-color: #0F172A;
    box-shadow: 0 4px 12px rgba(15,23,42,0.2);
    transform: translateY(-60%) scale(1.05);
  }
  .mc-arrow-left { left: -18px; }
  .mc-arrow-right { right: -18px; }

  @media (max-width: 768px) {
    .mc-card { flex: 0 0 180px; }
    .mc-arrow { width: 32px; height: 32px; }
    .mc-arrow-left { left: 10px; }
    .mc-arrow-right { right: 10px; }
  }
  @media (max-width: 480px) {
    .mc-card { flex: 0 0 155px; }
    .mc-content { padding: 10px 12px 12px; }
    .mc-name { font-size: 0.8rem !important; }
    .mc-price { font-size: 0.9rem !important; }
  }
`;
