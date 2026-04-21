"use client";

import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

export function CategoryCircleGrid({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .cat-grid-scroll::-webkit-scrollbar { display: none; }
        .cat-circle-item { transition: transform 0.2s ease; text-decoration: none; }
        .cat-circle-item:hover { transform: scale(1.07); }
        .cat-circle-img-wrap { }

        .cat-grid-scroll {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: x mandatory;
          gap: 12px;
          padding: 16px 3vw 24px;
        }

        .cat-circle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          scroll-snap-align: start;
          min-width: 100px;
        }

        .cat-circle-img-wrap {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .cat-circle-label {
          font-size: 0.82rem;
          font-weight: 500;
          color: #111827;
          text-align: center;
          line-height: 1.3;
          max-width: 100px;
        }

        @media (min-width: 768px) {
          .cat-grid-scroll {
            gap: 20px;
            padding: 24px 4vw 32px;
            justify-content: center;
          }
          .cat-circle-item { min-width: 150px; gap: 14px; }
          .cat-circle-img-wrap { width: 150px; height: 140px; }
          .cat-circle-label { font-size: 0.9rem; max-width: 140px; }
        }

        @media (min-width: 1280px) {
          .cat-grid-scroll { gap: 36px; padding: 36px 5vw 36px; }
          .cat-circle-item { min-width: 170px; gap: 16px; }
          .cat-circle-img-wrap { width: 170px; height: 170px; }
          .cat-circle-label { font-size: 0.95rem; max-width: 160px; }
        }
      ` }} />
      <div className="cat-grid-scroll">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="cat-circle-item"
          >
            <div className="cat-circle-img-wrap">
              <Image
                src={cat.image_url || "/assets/drone-product.png"}
                alt={cat.name}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span className="cat-circle-label">{cat.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
