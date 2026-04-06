"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import Image from "next/image";

export function ProductCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -window.innerWidth * 0.5, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: window.innerWidth * 0.5, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="position-relative w-100 py-2">
      {/* Hide scrollbar with inline styles for cross-browser compat */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .dji-carousel-scroll::-webkit-scrollbar { display: none; }
      `}} />

      <div
        className="d-flex gap-4 px-3 px-md-5 overflow-auto dji-carousel-scroll"
        ref={scrollRef}
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none", /* IE */
          WebkitOverflowScrolling: "touch",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id || product.name}
            className="flex-shrink-0"
            style={{
              scrollSnapAlign: "center",
              width: "90vw",
              maxWidth: "500px",
            }}
          >
            <div className="position-relative w-100 overflow-hidden dji-tile bg-white rounded-4 shadow-sm" style={{ aspectRatio: "4/3", border: "1px solid #eaeaea" }}>
              <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: 1, backgroundColor: "#f8f9fa" }}>
                <Image
                  src={product.images?.[0]?.url || product.image || "/assets/drone-product.png"}
                  alt={product.name}
                  fill
                  className="w-100 h-100 dji-tile-img transition-all object-fit-cover"
                />
              </div>

              <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5" style={{ zIndex: 2, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }}>
                <div className="text-white">
                  <span className="d-block mb-6 text-uppercase fw-bold" style={{ fontSize: "0.52rem", letterSpacing: "0.15em", color: "#60a5fa" }}>
                    {product.categoryName || product.subtitle || "Premium Series"}
                  </span>
                  <h3 className="fw-bold mb-3" style={{ fontSize: "clamp(0.8rem, 3.5vw, 1.2rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {product.name}
                  </h3>


                  <div className="d-flex flex-wrap gap-3">
                    <Link href={product.slug ? `/products/${product.slug}` : "/products"} className="dji-border-btn text-white d-inline-flex align-items-center" style={{ border: "0.5px solid white", padding: "12px 28px", fontWeight: "200", borderRadius: "30px", }}>
                      Дэлгэрэнгүй <ArrowRight size={16} className="ms-2" />
                    </Link>
                  </div>
                </div>
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
            className="btn btn-light position-absolute start-0 top-50 translate-middle-y ms-2 ms-md-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center p-0 flex-shrink-0"
            style={{ width: "56px", height: "56px", zIndex: 10, opacity: 0.9, backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.1)" }}
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={scrollRight}
            className="btn btn-light position-absolute end-0 top-50 translate-middle-y me-2 me-md-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center p-0 flex-shrink-0"
            style={{ width: "56px", height: "56px", zIndex: 10, opacity: 0.9, backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.1)" }}
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </div>
  );
}
