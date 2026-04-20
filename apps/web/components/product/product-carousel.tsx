"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { formatMoney } from "@deer-drone/utils";

export function ProductCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <div style={{ position: "relative", width: "100%", paddingBlock: "8px" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .carousel-scroll::-webkit-scrollbar { display: none; }
        .carousel-card { transition: box-shadow 0.25s ease, transform 0.25s ease; }
        .carousel-card:hover { box-shadow: 6px 6px 24px rgba(0,0,0,0.1) !important; transform: translate(-2px, -2px); }
        .carousel-card .card-actions { opacity: 0; transform: translateX(16px); pointer-events: none; transition: opacity 0.25s ease, transform 0.25s ease; }
        .carousel-card .card-img { transition: transform 0.4s ease; }
        .carousel-card:hover .card-img { transform: scale(1.06); }
        .carousel-card .card-actions button:nth-child(1) { transition-delay: 0s; }
        .carousel-card .card-actions button:nth-child(2) { transition-delay: 0.05s; }
        .carousel-card .card-actions button:nth-child(3) { transition-delay: 0.1s; }
        .carousel-card:hover .card-actions { opacity: 1; transform: translateX(0); pointer-events: auto; }
        .carousel-nav-btn { background: transparent !important; border: none !important; box-shadow: none !important; transition: background 0.2s ease, box-shadow 0.2s ease, backdrop-filter 0.2s ease; }
        .carousel-nav-btn:hover { background: rgba(0,0,0,0.02) !important; !important; backdrop-filter: blur(10px) !important; }
      ` }} />

      <div
        ref={scrollRef}
        className="carousel-scroll"
        style={{
          display: "flex",
          gap: "20px",
          padding: "8px 3vw",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id || product.name}
            className="carousel-card"
            onClick={() => product.slug && router.push(`/products/${product.slug}`)}
            style={{
              flexShrink: 0,
              width: "min(440px, 90vw)",
              scrollSnapAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              cursor: "pointer",
            }}
          >
            {/* Image + Action Icons */}
            <div style={{ position: "relative" }}>
              <div
                style={{ position: "relative", height: "min(430px, 70vw)", backgroundColor: "#f8f9fa", cursor: "pointer", overflow: "hidden" }}
                onClick={() => product.slug && router.push(`/products/${product.slug}`)}
              >
                <Image
                  src={product.images?.[0]?.url || product.image || "/assets/drone-product.png"}
                  alt={product.name}
                  fill
                  className="card-img"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Action Icons */}
              <div className="card-actions" style={{
                position: "absolute", right: "10px", top: "10px",
                display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <button
                  onClick={() => product.slug && router.push(`/products/${product.slug}`)}
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    backgroundColor: "#fff", border: "1px solid #e5e7eb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <Eye size={16} color="#374151" />
                </button>
                <button
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    backgroundColor: "#fff", border: "1px solid #e5e7eb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <ShoppingCart size={16} color="#374151" />
                </button>
              </div>

              
            </div>
            {/* Info */}
            <div style={{padding: "14px 16px", backgroundColor: "rgba(0,0,0,0.03)", backdropFilter: "blur(20px)"}}>
              <p style={{
                fontSize: "0.95rem", fontWeight: 600, color: "#111827",
                margin: "0 0 6px 0", lineHeight: 1.4,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {product.name}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {product.price != null && (
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
                    {formatMoney(product.price)}
                  </span>
                )}
                {product.comparePrice && product.comparePrice > product.price && (
                  <span style={{ fontSize: "0.85rem", color: "#9ca3af", textDecoration: "line-through" }}>
                    {formatMoney(product.comparePrice)}
                  </span>
                )}
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {products.length > 1 && (
        <>
          <button
            onClick={scrollLeft}
            className="carousel-nav-btn"
            style={{
              position: "absolute", left: "4px", top: "50%", transform: "translateY(-50%)",
              width: "44px", height: "44px", borderRadius: "50%", zIndex: 10,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
          >
            <ChevronLeft size={24} color="#111827" />
          </button>
          <button
            onClick={scrollRight}
            className="carousel-nav-btn"
            style={{
              position: "absolute", right: "4px", top: "50%", transform: "translateY(-50%)",
              width: "44px", height: "44px", borderRadius: "50%", zIndex: 10,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
          >
            <ChevronRight size={24} color="#111827" />
          </button>
        </>
      )}
    </div>
  );
}
