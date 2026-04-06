import { getProducts, getCategories, getBrands } from "../../../lib/supabase/queries";
import { ListingBreadcrumbs } from "../../../components/product/listing-breadcrumbs";
import { ListingSidebar } from "../../../components/product/listing-sidebar";
import { ListingHeader } from "../../../components/product/listing-header";
import { ListingProductCard } from "../../../components/product/listing-product-card";
import Link from "next/link";
import { Filter } from "lucide-react";

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
  const activeCategory = params.category || params.cat;
  const activeBrand = params.brand;
  const searchQuery = params.q || params.query || params.search;
  const sort = params.sort;

  // Fetch all required data
  const [products, categories, brands] = await Promise.all([
    getProducts({
      categorySlug: activeCategory,
      brand: activeBrand,
      search: searchQuery,
      sort: sort
    }),
    getCategories(),
    getBrands()
  ]);

  // Find active category object for breadcrumbs
  const categoryObj = categories.find(c => c.slug === activeCategory);

  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: "Бүтээгдэхүүн", href: "/products" },
  ];

  if (categoryObj) {
    breadcrumbItems.push({ label: categoryObj.name });
  } else if (activeBrand) {
    breadcrumbItems.push({ label: activeBrand });
  } else if (searchQuery) {
    breadcrumbItems.push({ label: `Хайлт: ${searchQuery}` });
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container py-4">
        {/* Top Breadcrumbs */}
        <ListingBreadcrumbs items={breadcrumbItems} />

        <div className="row g-4 mt-2">
          {/* Left Sidebar - 3 columns on LG */}
          <div className="col-12 col-lg-3 d-none d-lg-block">
            <ListingSidebar
              categories={categories}
              brands={brands}
              activeCategory={activeCategory}
              activeBrand={activeBrand}
            />
          </div>

          {/* Main Content - 9 columns on LG */}
          <div className="col-12 col-lg-9">

            {/* Brands Logo Highlights or Series Tabs could go here */}
            {activeCategory === 'consumer' || !activeCategory && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-4 mb-4 pb-2 overflow-auto" style={{ scrollbarWidth: "none" }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary small fw-bold">Брэндүүд:</span>
                    <img src="https://www.dji.com/assets/images/v3/nav/dji-logo.svg" alt="DJI" style={{ height: "24px", opacity: 0.8 }} />
                  </div>
                </div>
              </div>
            )}

            {/* Header: Count and Sort */}
            <ListingHeader count={products.length} />

            {/* Grid */}
            {products.length > 0 ? (
              <div className="row g-4 listing-grid">
                {products.map((product) => (
                  <div key={product.id} className="col-6 col-md-4 col-xl-3">
                    <ListingProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-5 text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: "80px", height: "80px" }}>
                  <Filter size={32} className="text-muted" />
                </div>
                <h4 className="fw-bold">Бараа олдсонгүй</h4>
                <p className="text-secondary">Та шүүлтүүрээ өөрчлөөд дахин оролдоно уу.</p>
                <Link href="/products" className="btn btn-dark rounded-pill px-4 py-2 mt-2">
                  Бүх барааг харах
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
