import Link from "next/link";
import { getProducts } from "../../../lib/supabase/queries";
import { formatMoney } from "@deer-drone/utils";
import type { Product } from "@deer-drone/types";

export default async function ProductsPage() {
  const allProducts = await getProducts();
  
  // Group products by category
  const categories = allProducts.reduce((acc: Record<string, Product[]>, product: Product) => {
    const catName = product.categoryName || "Бусад";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const categoryList = Object.keys(categories);

  return (
    <div className="products-page bg-white text-sans-serif">
      {/* ── Hero Banner ───────────────────────── */}
      <section className="bg-dark py-5 mb-5 position-relative overflow-hidden" style={{ minHeight: "400px", display: "flex", alignItems: "center" }}>
        <div className="position-absolute w-100 h-100 top-0 left-0" style={{ zIndex: 0, opacity: 0.6 }}>
           {/* Placeholder for hero image */}
           <div className="w-100 h-100 bg-secondary"></div>
        </div>
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 text-white pt-4">
              <span className="text-primary fw-bold text-uppercase small mb-2 d-block" style={{ letterSpacing: "2px" }}>Шинэ загвар</span>
              <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: "-0.02em" }}>DJI AVATA 2</h1>
              <p className="fs-5 opacity-75 mb-4 max-w-md">Туршиж, худалдаална. Нислэгийн мэдрэмжийг өөрчлөх шинэ үеийн FPV дрон.</p>
              <Link href="/products/avata-2" className="dji-solid-btn text-decoration-none">Одоо үзэх</Link>
            </div>
            <div className="col-12 col-lg-6 mt-5 mt-lg-0">
               <img src="/assets/hero-drone.png" alt="DJI Avata 2" className="img-fluid drop-shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Sections ─────────────────────── */}
      {categoryList.length > 0 ? (
        categoryList.map((catName) => (
          <ProductCategory
            key={catName}
            title={catName}
            description="Дэлхий даяар дөнгөж нээлтээ хийгээд буй шинэ үеийн ухаалаг төхөөрөмжүүд – таны амьдралыг дээшлүүлэн авчирах шилдэг шийдлүүдийг бид нэг дор цуглууллаа."
            products={categories[catName]}
          />
        ))
      ) : (
        <div className="container py-5 text-center">
          <h3 className="text-secondary">Бүтээгдэхүүн одоогоор байхгүй байна.</h3>
        </div>
      )}
    </div>
  );
}

function ProductCategory({
  title,
  description,
  products,
}: {
  title: string;
  description: string;
  products: any[];
}) {
  return (
    <section className="py-5" style={{ background: '#ffffff' }}>
      <div className="container">
        {/* Section heading */}
        <div className="mb-5 border-bottom pb-4">
          <h2 className="fw-bold mb-3" style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}>{title}</h2>
          <p className="text-secondary fs-5 max-w-xl" style={{ maxWidth: "700px" }}>{description}</p>
        </div>

        {/* Product grid */}
        <div className="row g-4 mb-5">
          {products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-3">
              <Link href={`/products/${product.slug}`} className="text-decoration-none group">
                <div className="card h-100 border-0 product-card-dji p-3 transition-all">
                  <div className="bg-light rounded-3 mb-4 overflow-hidden d-flex align-items-center justify-content-center p-4" style={{ height: "240px" }}>
                    <img 
                      src={product.images?.[0]?.url || "/assets/drone-product.png"} 
                      alt={product.name} 
                      className="img-fluid object-fit-contain h-100 w-100 transition-all hover-scale"
                    />
                  </div>
                  <div className="card-body p-0 text-center">
                    <h5 className="fw-bold text-dark mb-2">{product.name}</h5>
                    <p className="text-secondary small mb-3">{product.shortDescription}</p>
                    <div className="fw-bold text-primary fs-5">{formatMoney(product.price)}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
