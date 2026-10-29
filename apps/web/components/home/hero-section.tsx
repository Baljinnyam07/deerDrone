"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Series } from "../../lib/showcase";

interface HeroSectionProps {
  slides: Series[];
}

const SLIDE_MS = 7000;

export function HeroSection({ slides }: HeroSectionProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const go = useCallback(
    (index: number) => setActive((index + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setTimeout(() => go(active + 1), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, go, slides.length]);

  // Only the visible slide's video plays.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) video.play().catch(() => {});
      else video.pause();
    });
  }, [active]);

  // The home header sits transparently on the hero and takes its text colour
  // from the visible slide (white on dark video, dark on light renders).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.heroTheme = slides[active]?.theme === "dark" ? "dark" : "light";
    return () => {
      delete root.dataset.heroTheme;
    };
  }, [active, slides]);

  if (slides.length === 0) return null;
  const activeTheme = slides[active]?.theme === "dark" ? "dark" : "light";

  return (
    <section
      className="dj-hero"
      aria-roledescription="carousel"
      aria-label="Онцлох бүтээгдэхүүн"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const theme = slide.theme === "dark" ? "dark" : "light";
        return (
          <div
            key={slide.id}
            className={`dj-hero-slide dj-theme-${theme}${slide.video ? " has-video" : ""}${i === active ? " is-active" : ""}`}
            aria-hidden={i !== active}
          >
            {slide.video ? (
              <>
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className="dj-hero-media"
                  muted
                  loop
                  playsInline
                  autoPlay={i === 0}
                  preload={i === 0 ? "auto" : "none"}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
                <div className="dj-hero-shade" />
              </>
            ) : null}

            <div className="dj-hero-copy">
              <p className="dj-eyebrow">{slide.eyebrow}</p>
              {i === 0 ? (
                <h1 className="dj-hero-title">{slide.title}</h1>
              ) : (
                <h2 className="dj-hero-title">{slide.title}</h2>
              )}
              <p className="dj-hero-tagline">{slide.tagline}</p>
              <div className="dj-hero-ctas">
                <Link href={`/products/${slide.slug}`} className="dj-btn" tabIndex={i === active ? 0 : -1}>
                  Дэлгэрэнгүй <ChevronRight size={14} />
                </Link>
                <Link href={`/products/${slide.slug}/buy`} className="dj-btn" tabIndex={i === active ? 0 : -1}>
                  Худалдаж авах <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {!slide.video && (
              <div className="dj-hero-product">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="dj-cutout"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <ul className={`dj-hero-index on-${activeTheme}`}>
          {slides.map((slide, i) => (
            <li key={slide.id}>
              <button
                type="button"
                className={i === active ? "is-active" : ""}
                aria-label={slide.shortName}
                aria-current={i === active}
                onClick={() => go(i)}
              >
                {slide.shortName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
