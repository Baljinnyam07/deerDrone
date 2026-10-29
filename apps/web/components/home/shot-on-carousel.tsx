"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ShotOnCarousel({ videos }: { videos: string[] }) {
  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Centre the active slide so the neighbours peek in from both sides.
  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      const slide = track?.children[active] as HTMLElement | undefined;
      if (!track || !slide) return;
      setOffset(window.innerWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (inView && i === active) video.play().catch(() => {});
      else video.pause();
    });
  }, [active, inView]);

  if (videos.length === 0) return null;
  const go = (i: number) => setActive((i + videos.length) % videos.length);

  return (
    <section className="dj-shot" ref={sectionRef} aria-label="Shot on DJI">
      <h2 className="dj-section-title">Shot on DJI</h2>
      <p className="dj-section-sub" style={{ marginBottom: 40 }}>
        DJI төхөөрөмжөөр бүтээгдсэн гайхалтай агшнууд.
      </p>
      <div style={{ position: "relative" }}>
        <div className="dj-shot-track" ref={trackRef} style={{ transform: `translateX(${offset}px)` }}>
          {videos.map((src, i) => (
            <div
              key={src}
              className={`dj-shot-slide${i === active ? " is-active" : ""}`}
              onClick={() => i !== active && go(i)}
              style={{ cursor: i === active ? "default" : "pointer" }}
            >
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
              >
                <source src={src} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
        {videos.length > 1 && (
          <>
            <button type="button" className="dj-shot-nav" style={{ left: "calc(8vw - 22px)" }} aria-label="Өмнөх" onClick={() => go(active - 1)}>
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="dj-shot-nav" style={{ right: "calc(8vw - 22px)" }} aria-label="Дараах" onClick={() => go(active + 1)}>
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
      <div className="dj-shot-dots">
        {videos.map((src, i) => (
          <button key={src} type="button" aria-label={`Видео ${i + 1}`} className={i === active ? "is-active" : ""} onClick={() => go(i)} />
        ))}
      </div>
    </section>
  );
}
