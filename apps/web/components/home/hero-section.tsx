"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Product } from "@deer-drone/types";

interface HeroSectionProps {
  heroVideo: string;
  heroProduct: Product | null;
}

export function HeroSection({ heroVideo, heroProduct }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onScroll = () => {
      video.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="position-relative w-100 overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      <video
        ref={videoRef}
        className="position-absolute w-100"
        style={{
          objectFit: "cover",
          top: "-10%",
          left: 0,
          height: "120%",
          zIndex: 0,
          willChange: "transform",
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        key={heroVideo}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      <div
        className="position-absolute w-100 h-100"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          zIndex: 1,
          top: 0,
          left: 0,
        }}
      />

      <div
        className="position-absolute w-100 h-100 d-flex align-items-center text-white px-4 px-md-5"
        style={{ zIndex: 2, left: 0 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6">
              <h2
                className="fw-bold mb-3"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                }}
              >
                {heroProduct?.name || "DEER ACTION CAM"}
              </h2>

              <p
                className="fs-5 mb-4"
                style={{
                  fontWeight: 300,
                  fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                  maxWidth: "500px",
                  lineHeight: 1.6,
                }}
              >
                {heroProduct?.shortDescription || "Адал явдалд бэлэн"}
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link
                  href={`/products/${heroProduct?.slug || "action-4"}`}
                  className="dji-border-btn"
                >
                  Дэлгэрэнгүй <ArrowRight size={16} className="ms-2 mt-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
