import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatPrice, type Series } from "../../lib/showcase";

export function ProductBannerGrid({ series }: { series: Series[] }) {
  if (series.length === 0) return null;

  return (
    <section className="dj-grid" aria-label="Бүтээгдэхүүний цуврал">
      {series.map((item, i) => {
        // An odd count leaves the last card alone on its row: stretch it.
        const isWide = series.length % 2 === 1 && i === series.length - 1;
        return (
          <article key={item.id} className={`dj-card${isWide ? " is-wide" : ""}`}>
            <p className="dj-eyebrow">{item.eyebrow}</p>
            <h2 className="dj-card-title">{item.title}</h2>
            <p className="dj-card-tagline">{item.tagline}</p>
            <div className="dj-card-links">
              <Link href={`/products/${item.slug}`} className="dj-link">
                Дэлгэрэнгүй <ChevronRight size={16} />
              </Link>
              <Link href={`/products/${item.slug}`} className="dj-link">
                Худалдаж авах <ChevronRight size={16} />
              </Link>
            </div>
            <Link href={`/products/${item.slug}`} className="dj-card-media" tabIndex={-1} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="dj-cutout" loading="lazy" />
            </Link>
            <span className="dj-card-price">{formatPrice(item.price)}-с эхэлнэ</span>
          </article>
        );
      })}
    </section>
  );
}
