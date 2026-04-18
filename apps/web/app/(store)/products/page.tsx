// products/page.tsx

import { getProducts } from "../../../lib/supabase/queries";
import { PremiumProductCard } from "../../../components";
import Image from "next/image";

type ProductsSearchParams = Promise<{
  category?: string;
  cat?: string;
  brand?: string;
  q?: string;
  query?: string;
  search?: string;
  sort?: any;
}>;

const CATEGORY_BANNERS: Record<
  string,
  {
    image: string;
    title: string;
    position?: string;
    desc?: string;
    brands?: { src: string; alt: string; width: number; height: number }[];
  }
> = {
  all: {
    image:
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1800&q=90",
    title: "БҮХ БҮТЭЭГДЭХҮҮН",
    position: "center 48%",
    desc: "Premium aerial systems, imaging tools, and carefully selected accessories for creators and professionals.",
    brands: [
      { src: "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/dji.svg", alt: "DJI", width: 48, height: 18 },
    ],
  },
  drones: {
    image:
      "https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg?_gl=1*1unlgbd*_ga*MTM0MjY0OTIyNy4xNzc2NTIyMTk1*_ga_8JE65Q40S6*czE3NzY1MjIxOTQkbzEkZzEkdDE3NzY1MjIyNjYkajU5JGwwJGgw",
    title: "ДРОН",
    position: "center 54%",
    desc: "Aerial imaging, cinematic flight, and next-level control for modern creators.",
    brands: [
      { src: "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/dji.svg", alt: "DJI", width: 48, height: 18 },
    ],
  },
  cameras: {
    image:
      "https://images.pexels.com/photos/36996855/pexels-photo-36996855.jpeg?_gl=1*12s37vk*_ga*MTM0MjY0OTIyNy4xNzc2NTIyMTk1*_ga_8JE65Q40S6*czE3NzY1MjIxOTQkbzEkZzEkdDE3NzY1MjI5NjMkajUkbDAkaDA.",
    title: "КАМЕР",
    position: "center 42%",
    desc: "Compact imaging systems built for action, storytelling, and professional content.",
    brands: [
      { src: "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/dji.svg", alt: "DJI", width: 48, height: 18 },
    ],
  },
  accessories: {
    image:
      "https://images.pexels.com/photos/9179881/pexels-photo-9179881.jpeg?_gl=1*18r4e0m*_ga*MTM0MjY0OTIyNy4xNzc2NTIyMTk1*_ga_8JE65Q40S6*czE3NzY1MjIxOTQkbzEkZzEkdDE3NzY1MjI2MDAkajgkbDAkaDA.",
    title: "ДАГАЛДАХ ХЭРЭГСЭЛ",
    position: "center 50%",
    desc: "Essential tools that expand performance, protection, and flexibility.",
    brands: [
      { src: "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/dji.svg", alt: "DJI", width: 48, height: 18 },
    ],
  },
  handheld: {
    image:
      "https://images.pexels.com/photos/35525745/pexels-photo-35525745.jpeg?_gl=1*1x4ifit*_ga*MTM0MjY0OTIyNy4xNzc2NTIyMTk1*_ga_8JE65Q40S6*czE3NzY1MjIxOTQkbzEkZzEkdDE3NzY1MjI0NTIkajUkbDAkaDA.",
    title: "ГАР ТӨХӨӨРӨМЖ",
    position: "center 40%",
    desc: "Portable motion tools made for smooth, high-quality visual storytelling.",
    brands: [
      { src: "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/dji.svg", alt: "DJI", width: 48, height: 18 },
      
    ],
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const params = await searchParams;
  const activeCategory = params.category || params.cat || "all";
  const activeBrand = params.brand;
  const searchQuery = params.q || params.query || params.search;
  const sort = params.sort || "popular";

  const products = await getProducts({
    categorySlug: activeCategory === "all" ? undefined : activeCategory,
    brand: activeBrand,
    search: searchQuery,
    sort,
  });

  const banner = CATEGORY_BANNERS[activeCategory] ?? CATEGORY_BANNERS.all;

  return (
    <main className="p-root">
      <section className="p-hero-wrap">
        <div className="p-hero">
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            priority
            className="p-hero-img"
            sizes="(max-width: 768px) 100vw, 1280px"
            style={{ objectPosition: banner.position || "center center" }}
          />
          <div className="p-hero-overlay" />

          <div className="p-hero-content">
            

            <h1 className="p-hero-title">{banner.title}</h1>
            <div className="p-hero-brands">
              {banner.brands?.map((brand) => (
                <div className="p-hero-brand" key={brand.alt}>
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={brand.width}
                    height={brand.height}
                    className="p-hero-brand-img"
                  />
                </div>
              ))}
              <div className="p-hero-brand p-hero-brand-text">POTENSIC</div>
              <div className="p-hero-brand p-hero-brand-text">FIMI</div>
              <div className="p-hero-brand p-hero-brand-text">MJX</div>
              <div className="p-hero-brand p-hero-brand-text">STARTRC</div>
              <div className="p-hero-brand p-hero-brand-text">BRDRC</div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-grid-wrap">

        {products.length > 0 ? (
          <div className="p-grid">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="p-card-shell p-card-anim"
                style={{ animationDelay: `${(idx % 12) * 0.04}s` }}
              >
                <PremiumProductCard
                  product={product}
                  badge={idx === 0 ? "new" : idx === 1 ? "best-seller" : undefined}
                  discount={idx === 2 ? 15 : undefined}
                  rating={Number((4.2 + (idx % 5) * 0.16).toFixed(1))}
                  reviewCount={20 + (idx % 8) * 19}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-empty">
            <p>Үр дүн олдсонгүй</p>
          </div>
        )}
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');

        .p-root {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 100px;
          background:
            radial-gradient(circle at top, rgba(15, 23, 42, 0.04), transparent 28%),
            linear-gradient(to bottom, #f8fafc 0%, #ffffff 26%, #ffffff 100%);
        }

        .p-hero-wrap {
          max-width: 1280px;
          margin: 20px auto 0;
          padding: 0 32px;
        }

        .p-hero {
          position: relative;
          width: 100%;
          height: clamp(340px, 38vw, 520px);
          border-radius: 30px;
          overflow: hidden;
          background: #0f172a;
          box-shadow:
            0 28px 70px rgba(2, 6, 23, 0.14),
            0 10px 28px rgba(2, 6, 23, 0.08);
        }

        .p-hero-img {
          object-fit: cover;
          transform: scale(1.045);
          transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
          filter: saturate(1.05) contrast(1.03) brightness(0.88);
        }

        .p-hero:hover .p-hero-img {
          transform: scale(1.08);
        }

        .p-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(2, 6, 23, 0.04) 0%, rgba(2, 6, 23, 0.18) 40%, rgba(2, 6, 23, 0.66) 100%),
            linear-gradient(90deg, rgba(2, 6, 23, 0.56) 0%, rgba(2, 6, 23, 0.18) 42%, rgba(2, 6, 23, 0.04) 100%);
        }

        .p-hero-content {
          position: absolute;
          left: 42px;
          right: 42px;
          bottom: 34px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .p-hero-brands {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .p-hero-brand {
          height: 34px;
          min-width: 34px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .p-hero-brand-img {
          width: auto;
          height: 16px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.95;
        }

        .p-hero-brand-text {
          color: rgba(255,255,255,0.88);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .p-hero-title {
          margin: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.8rem, 6vw, 6rem);
          line-height: 0.94;
          letter-spacing: 0.03em;
          color: #ffffff;
          text-transform: uppercase;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        .p-hero-desc {
          margin: 12px 0 0;
          max-width: 62ch;
          color: rgba(255,255,255,0.8);
          font-size: 0.98rem;
          line-height: 1.72;
        }

        .p-grid-wrap {
          max-width: 1280px;
          margin: 28px auto 0;
          padding: 0 32px;
        }

        .p-grid-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .p-grid-meta {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .p-grid-count {
          font-size: 1.6rem;
          line-height: 1;
          font-weight: 800;
          color: #0f172a;
        }

        .p-grid-label {
          color: #64748b;
          font-size: 0.95rem;
        }

        .p-grid-search {
          color: #475569;
          font-size: 0.95rem;
          padding: 10px 14px;
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .p-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          align-items: stretch;
        }

        .p-card-shell {
          height: 100%;
          display: flex;
        }

        .p-card-shell > * {
          width: 100%;
          height: 100%;
        }

        .p-card-anim {
          opacity: 0;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        /* Card height balancing */
        .p-grid :is(a, article, div).premium-product-card,
        .p-grid [class*="product-card"] {
          height: 100%;
        }

        .p-grid [class*="product-card"],
        .p-grid [class*="premium-product-card"] {
          display: flex;
          flex-direction: column;
        }

        .p-grid [class*="card-body"],
        .p-grid [class*="product-content"],
        .p-grid [class*="card-content"] {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .p-grid h3,
        .p-grid h4,
        .p-grid [class*="title"] {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 3.2em;
          line-height: 1.6;
        }

        .p-grid [class*="price"],
        .p-grid .price {
          margin-top: auto;
        }

        .p-empty {
          padding: 100px 0;
          text-align: center;
          color: #64748b;
          font-size: 0.95rem;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .p-grid-head {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .p-hero-wrap,
          .p-grid-wrap {
            padding: 0 16px;
          }

          .p-hero {
            height: 240px;
            border-radius: 20px;
          }

          .p-hero-content {
            left: 20px;
            right: 20px;
            bottom: 18px;
          }

          .p-hero-brands {
            gap: 8px;
            margin-top: 12px;
          }

          .p-hero-brand {
            height: 30px;
            padding: 0 10px;
          }

          .p-hero-brand-img {
            height: 14px;
          }

          .p-hero-brand-text {
            font-size: 10px;
            letter-spacing: 0.12em;
          }

          .p-hero-title {
            font-size: 2.5rem;
          }

          .p-hero-desc {
            display: none;
          }

          .p-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
        }
      `}</style>
    </main>
  );
}