"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function NavProgress() {
  const pathname  = usePathname();
  const barRef    = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Холбоос дарахад progress эхлэх
  useEffect(() => {
    function onLinkClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:\/\//.test(href)) return;
      if (a.target === "_blank") return;

      const bar = barRef.current;
      if (!bar) return;
      bar.style.transition = "none";
      bar.style.opacity    = "1";
      bar.style.width      = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.transition = "width 600ms cubic-bezier(0.1, 0.6, 0.4, 1)";
          bar.style.width      = "80%";
        });
      });
    }

    document.addEventListener("click", onLinkClick);
    return () => document.removeEventListener("click", onLinkClick);
  }, []);

  // Хуудас солигдмогц progress дуусгах
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const bar = barRef.current;
    if (!bar) return;

    bar.style.transition = "width 150ms ease";
    bar.style.width      = "100%";

    const hideId = setTimeout(() => {
      bar.style.transition = "opacity 250ms ease";
      bar.style.opacity    = "0";
    }, 180);

    const resetId = setTimeout(() => {
      bar.style.transition = "none";
      bar.style.width      = "0%";
    }, 450);

    return () => { clearTimeout(hideId); clearTimeout(resetId); };
  }, [pathname]);

  return (
    <div
      ref={barRef}
      style={{
        position:        "fixed",
        top:             0,
        left:            0,
        height:          "3px",
        width:           "0%",
        background:      "linear-gradient(90deg, #0f172a 0%, #475569 100%)",
        opacity:         0,
        zIndex:          9999,
        pointerEvents:   "none",
        borderRadius:    "0 2px 2px 0",
      }}
    />
  );
}
