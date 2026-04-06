"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMoney } from "@deer-drone/utils";

import Image from "next/image";

export function MinimalProductCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="position-relative w-100">
      <style dangerouslySetInnerHTML={{__html: `
        .minimal-carousel-scroll::-webkit-scrollbar { display: none; }
        .minimal-card {
          transition: all 0.2s ease-in-out;
          border: 1px solid transparent;
        }
        .minimal-card:hover {
          border-color: #e5e7eb;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .minimal-card-img-container {
          background-color: #f9fafb;
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 4px;
          margin-bottom: 12px;
          overflow: hidden;
        }
      `}} />

      <div 
        className="d-flex gap-3 overflow-auto minimal-carousel-scroll" 
        ref={scrollRef}
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          padding: "10px 0"
        }}
      >
        {products.map((product, idx) => (
          <Link 
            key={`${product.id}-${idx}`}
            href={product.slug ? `/products/${product.slug}` : "#"}
            className="flex-shrink-0 text-decoration-none"
            style={{ 
              scrollSnapAlign: "start",
              width: "240px",
            }}
          >
            <div className="minimal-card p-2 bg-white rounded">
              <div className="minimal-card-img-container position-relative">
                {/* Brand Logo Corner */}
                <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 2, opacity: 0.6 }}>
                   <span className="fw-bold" style={{ fontSize: "0.6rem", letterSpacing: "0.05em" }}>
                     {product.brand || "XGIMI"}
                   </span>
                </div>
                
                <Image
                  src={product.images?.[0]?.url || product.image || "/assets/drone-product.png"}
                  alt={product.name}
                  fill
                  className="w-100 h-100 object-fit-cover"
                />
              </div>

              <div className="px-1">
                <h4 className="text-dark fw-bold mb-1" style={{ fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {product.name}
                </h4>
                <div className="fw-bold" style={{ fontSize: "0.95rem", color: "#111827" }}>
                  {formatMoney(product.price)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Buttons - Smaller and simpler */}
      {products.length > 1 && (
        <>
          <button 
            onClick={scrollLeft}
            className="btn btn-light position-absolute start-0 top-50 translate-middle-y rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0"
            style={{ width: "32px", height: "32px", zIndex: 10, left: "-16px", backgroundColor: "white", border: "1px solid #eee" }}
          >
            <ChevronLeft size={18} />
          </button>

          <button 
            onClick={scrollRight}
            className="btn btn-light position-absolute end-0 top-50 translate-middle-y rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0"
            style={{ width: "32px", height: "32px", zIndex: 10, right: "-16px", backgroundColor: "white", border: "1px solid #eee" }}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
