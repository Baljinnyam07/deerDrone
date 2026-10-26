// products/page.tsx

import { Suspense } from "react";
import { ProductsSection } from "../../../components/product/products-section";
import { SkeletonCard } from "../../../components/ui/skeleton-card";
import { type SortOption } from "../../../lib/products-config";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteUrl } from "../../../lib/server-env";
import { getProducts, getCategories } from "../../../lib/supabase/queries";
import { CATEGORY_LABELS, resolveSeries } from "../../../lib/showcase";

type ProductsSearchParams = Promise<{
  category?: string;
  cat?: string;
  brand?: string;
  q?: string;
  query?: string;
  search?: string;
  sort?: string;
}>;

export async function generateMetadata({ searchParams }: { searchParams: ProductsSearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const activeCategory = params.category || params.cat || "all";
  const searchQuery = params.q || params.query || params.search;
  
  if (searchQuery) {
    return {
      title: `Хайлт: ${searchQuery}`,
      description: `"${searchQuery}" хайлтад тохирох бүтээгдэхүүнүүд`,
    };
  }

  const banner = CATEGORY_BANNERS[activeCategory] ?? CATEGORY_BANNERS.all;

  return {
    title: banner.title,
    description: banner.desc,
  };
}

const CATEGORY_BANNERS: Record<string, { title: string; desc: string }> = {
  all: {
    title: "Бүх бүтээгдэхүүн",
    desc: "DJI дрон, камер, гар төхөөрөмж болон дагалдах хэрэгслийн бүрэн жагсаалт.",
  },
  drones: {
    title: "Камер дрон",
    desc: "Мини дрон, FPV болон мэргэжлийн аэро зураг авалтын дроноор агшин бүрийг дээрээс нь мөнхлөөрэй.",
  },
  cameras: {
    title: "Камер",
    desc: "Халаасны гимбал, экшн болон 360° камерууд — аялал, влог, адал явдалд.",
  },
  handheld: {
    title: "Гар төхөөрөмж",
    desc: "Тогтворжуулагч, утасны гимбал, утасгүй микрофон — мэргэжлийн бүтээлд.",
  },
  power: {
    title: "Power",
    desc: "Зөөврийн цахилгаан станцууд — аялал, кемп, гэр болон ажлын талбайд.",
  },
  accessories: {
    title: "Дагалдах хэрэгсэл",
    desc: "Батерей, сэнс, хамгаалалт, хадгалах хайрцаг болон бусад хэрэгсэл.",
  },
};

const CATEGORY_ORDER = ["drones", "cameras", "handheld", "power", "accessories"];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const params = await searchParams;
  const activeCategory = params.category || params.cat || "all";
  const activeBrand = params.brand;
  const searchQuery = params.q || params.query || params.search;
  const VALID_SORTS: SortOption[] = ["newest", "price_asc", "price_desc", "name_asc"];
  const sort: SortOption | undefined = VALID_SORTS.includes(params.sort as SortOption)
    ? (params.sort as SortOption)
    : undefined;

  const categorySlug = activeCategory === "all" ? undefined : activeCategory;
  const banner = CATEGORY_BANNERS[activeCategory] ?? CATEGORY_BANNERS.all;

  const [allProducts, categories] = await Promise.all([getProducts(), getCategories()]);
  const series = resolveSeries(allProducts).filter((s) => s.category === activeCategory);
  const categoryTiles = CATEGORY_ORDER.map((slug) => {
    const cat = (categories as { slug: string; name: string; image_url?: string | null }[]).find((c) => c.slug === slug);
    return { slug, label: CATEGORY_LABELS[slug] ?? cat?.name ?? slug, image: cat?.image_url ?? "/assets/drone-product.png" };
  });

  const siteUrl = getSiteUrl();
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Нүүр",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": banner.title,
        "item": `${siteUrl}/products?category=${activeCategory}`
      }
    ]
  };

  return (
    <div className="p-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav className="dj-subnav" aria-label="Цуврал">
        <div className="dj-subnav-inner">
          {series.length > 0
            ? series.map((s) => (
                <Link key={s.id} href={`/products/${s.slug}`}>
                  <span className="dj-subnav-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="dj-cutout" />
                  </span>
                  {s.shortName}
                </Link>
              ))
            : categoryTiles.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  className={c.slug === activeCategory ? "is-active" : undefined}
                >
                  <span className="dj-subnav-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="" className="dj-cutout" />
                  </span>
                  {c.label}
                </Link>
              ))}
        </div>
      </nav>

      <header className="dj-list-head">
        <h1>{searchQuery ? `“${searchQuery}” хайлтын үр дүн` : banner.title}</h1>
        {!searchQuery && <p>{banner.desc}</p>}
      </header>

      <section>
        <Suspense
          key={`${categorySlug ?? "all"}-${activeBrand ?? ""}-${searchQuery ?? ""}-${sort}`}
          fallback={
            <div className="dj-product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-card-shell"><SkeletonCard /></div>
              ))}
            </div>
          }
        >
          <ProductsSection
            categorySlug={categorySlug}
            brand={activeBrand}
            search={searchQuery}
            sort={sort}
          />
        </Suspense>
      </section>

      <style>{`
        .p-root { min-height: 100vh; background: #fff; }
        .p-card-shell { display: flex; }
        .p-card-shell > * { width: 100%; }
        .p-card-anim { opacity: 0; animation: pFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes pFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
