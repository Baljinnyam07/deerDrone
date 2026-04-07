import { getProducts, getCategories, getBrands } from "../../../lib/supabase/queries";
import { PremiumProductCard, SkeletonCard } from "../../../components";
import type { Category } from "../../../components";
import Link from "next/link";

type ProductsSearchParams = Promise<{
  category?: string;
  cat?: string;
  brand?: string;
  q?: string;
  query?: string;
  search?: string;
  sort?: any;
}>;

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

  // Fetch all required data
  const [products, categories, brands] = await Promise.all([
    getProducts({
      categorySlug: activeCategory === "all" ? undefined : activeCategory,
      brand: activeBrand,
      search: searchQuery,
      sort: sort
    }),
    getCategories(),
    getBrands()
  ]);

  // Transform categories for CategoryTabs component
  const categoryTabs: Category[] = [
    {
      id: "all",
      name: "Бүхэлдээ",
      slug: "all",
      icon: "🛍️",
      count: products.length,
    },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: "🚁",
      count: products.filter(p => p.categoryId === cat.id).length,
    }))
  ];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      {/* Page Header */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 32px 32px",
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: "8px",
            lineHeight: 1.2,
          }}
        >
          Дрон каталог
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#475569",
            margin: 0,
          }}
        >
          {products.length} үр дүн · {activeCategory === "all" ? "Бүхэл каталог" : activeCategory}
        </p>
      </div>

      {/* Category Tabs - Using Links for Server Navigation */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px 24px",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollBehavior: "smooth", paddingBottom: "8px" }}>
          {categoryTabs.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === "all" ? "/products" : `/products?category=${cat.slug}`}
              style={{
                padding: "8px 16px",
                borderRadius: "24px",
                backgroundColor: activeCategory === cat.slug ? "#2563EB" : "#F1F5F9",
                color: activeCategory === cat.slug ? "#FFFFFF" : "#64748B",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              {(cat.count ?? 0) > 0 && (
                <span
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.7,
                    marginLeft: "4px",
                  }}
                >
                  ({cat.count})
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Search Bar - Server-side Form */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 32px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <form
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#F8FAFC",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              padding: "10px 16px",
            }}
            method="GET"
            action="/products"
          >
            <input
              type="text"
              name="q"
              placeholder="Дроны нэрээр хайх..."
              defaultValue={searchQuery || ""}
              style={{
                flex: 1,
                border: "none",
                backgroundColor: "transparent",
                fontSize: "0.95rem",
                color: "#0F172A",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "background-color 250ms",
              }}
            >
              Хайх
            </button>
          </form>
          {(searchQuery || activeBrand) && (
            <Link
              href="/products"
              style={{
                padding: "8px 16px",
                backgroundColor: "#F1F5F9",
                borderRadius: "6px",
                textDecoration: "none",
                color: "#475569",
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Цэвэрлэх
            </Link>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px 80px",
        }}
      >
        {products.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
            className="products-grid"
          >
            {products.map((product, idx) => (
              <PremiumProductCard
                key={product.id}
                product={product}
                badge={idx === 0 ? "new" : idx === 1 ? "best-seller" : undefined}
                discount={idx === 2 ? 15 : undefined}
                rating={Number((4.2 + (idx % 5) * 0.16).toFixed(1))}
                reviewCount={20 + (idx % 8) * 19}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <p
              style={{
                fontSize: "1.1rem",
                color: "#475569",
                marginBottom: "12px",
              }}
            >
              Хайлтын үр дүн олдсонгүй
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#94A3B8",
                marginBottom: "20px",
              }}
            >
              Өөр хайлт эсвэл шүүлтүүр оролдоно уу
            </p>
            <Link 
              href="/products" 
              style={{
                display: "inline-block",
                padding: "10px 24px",
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                borderRadius: "24px",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                transition: "background-color 250ms",
              }}
            >
              Бүх барааг харах
            </Link>
          </div>
        )}
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </main>
  );
}
