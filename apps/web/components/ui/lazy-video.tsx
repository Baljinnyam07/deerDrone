"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  /** Hero видео бол эхнээс нь load хийнэ, бусад нь viewport-д орсон үед */
  eager?: boolean;
  poster?: string;
}

/**
 * Production-grade lazy video component.
 *
 * Eager (hero):  preload="metadata" — browser зөвхөн header татна,
 *                viewport-д байгаа тул шууд play хийнэ.
 *
 * Lazy (showcase): preload="none" + IntersectionObserver —
 *                  viewport-д 10% орсон үед л src-ийг тавьж play хийнэ.
 *                  Үүнгүйгээр 3 видео нэгэн зэрэг network ашигладаг.
 */
export function LazyVideo({ src, className, style, eager = false, poster }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(eager ? src : null);
  const [isReady, setIsReady] = useState(false);

  // Src өөрчлөгдвөл (admin settings) шинэчилнэ
  useEffect(() => {
    if (eager) setActiveSrc(src);
  }, [src, eager]);

  // Lazy: IntersectionObserver-р viewport шалгана
  useEffect(() => {
    if (eager || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [eager, src]);

  // Src тавигдсан үед видеог play хийнэ
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSrc) return;

    // Src шинэ байвал load хийгээд play
    if (video.src !== activeSrc && !video.src.endsWith(activeSrc)) {
      video.load();
    }

    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay policy-р блоклогдсон үед silent fail — poster харагдана
      });
    };

    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener("canplay", playVideo, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", playVideo);
    };
  }, [activeSrc]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={{
        ...style,
        // Видео бэлэн болох хүртэл poster харагдана, transition-р зөөлөн орно
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
      muted
      loop
      playsInline
      poster={poster}
      preload={eager ? "metadata" : "none"}
      onCanPlay={() => setIsReady(true)}
      // ❌ key prop хэрэглэхгүй — шаардлагагүй DOM re-mount үүсгэдэг
    >
      {activeSrc && <source src={activeSrc} type="video/mp4" />}
    </video>
  );
}