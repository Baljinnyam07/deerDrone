"use client";

import Link from "next/link";
import { Shield, Truck, CreditCard } from "lucide-react";
import { useStore } from "../../../../store/useStore";
import type { Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";

export default function ProductDetailView({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <div className="bg-white pb-5">
      {/* Breadcrumb */}
      <div className="container py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0" style={{ fontSize: "0.85rem" }}>
            <li className="breadcrumb-item"><Link href="/" className="text-secondary text-decoration-none">Нүүр</Link></li>
            <li className="breadcrumb-item"><Link href={`/products?category=${product.categorySlug}`} className="text-secondary text-decoration-none">{product.categoryName}</Link></li>
            <li className="breadcrumb-item active text-dark fw-medium" aria-current="page">{product.name}</li>
          </ol>
        </nav>
      </div>

      <div className="container py-4">
        <div className="row g-5">
          {/* Left: Images */}
          <div className="col-12 col-md-6">
            <div className="bg-light rounded-4 overflow-hidden position-relative d-flex align-items-center justify-content-center p-5 mb-3" style={{ height: "500px", background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)" }}>
              {product.heroNote && (
                <span className="badge bg-primary position-absolute top-0 start-0 m-4 px-3 py-2 rounded-pill fw-medium">
                  {product.heroNote}
                </span>
              )}
              {product.stockQty <= 3 && product.stockQty > 0 && (
                <span className="badge bg-danger position-absolute top-0 end-0 m-4 px-3 py-2 rounded-pill fw-medium">
                  Цөөн үлдсэн
                </span>
              )}
              <img
                src={product.images?.[0]?.url || "/assets/drone-product.png"}
                alt={product.images?.[0]?.alt || product.name}
                className="w-100 object-fit-contain"
                style={{ transform: "rotate(-5deg)", filter: "drop-shadow(0 20px 13px rgba(0,0,0,0.15))" }}
              />
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="d-flex gap-2">
                {product.images.map((img, idx) => (
                  <div key={idx} className="bg-light rounded-3 p-2 border border-primary border-2 cursor-pointer" style={{ width: "80px", height: "80px" }}>
                    <img src={img.url} alt="thumb" className="w-100 h-100 object-fit-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="col-12 col-md-6 d-flex flex-column">
            <div className="mb-2 text-uppercase text-secondary fw-bold" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
              {product.brand}
            </div>
            <h1 className="fw-bold mb-3" style={{ fontFamily: "var(--font-ui), sans-serif", fontSize: "2.5rem" }}>
              {product.name}
            </h1>
            <p className="text-secondary mb-4 fs-5" style={{ lineHeight: "1.6" }}>
              {product.shortDescription}
            </p>

            <div className="bg-light p-4 rounded-4 mb-4">
              <div className="d-flex align-items-end gap-3 mb-2">
                <h2 className="text-primary fw-bold mb-0 m-0">{formatMoney(product.price)}</h2>
                {product.comparePrice && (product.comparePrice ?? 0) > product.price && (
                  <h5 className="text-muted text-decoration-line-through mb-1">{formatMoney(product.comparePrice ?? 0)}</h5>
                )}
              </div>
              
              {product.isLeasable && (
                <div className="d-flex align-items-center justify-content-between p-3 mt-3 bg-white rounded-3 border shadow-sm">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <div className="fw-bold text-dark fs-6" style={{ fontSize: "0.9rem" }}>Лизингээр авах боломжтой</div>
                      <div className="text-secondary" style={{ fontSize: "0.8rem" }}>Сард өгөх доод тал: ~{formatMoney(Math.floor(product.price / 12))} (12 сар)</div>
                    </div>
                  </div>
                  <Link href="/leasing" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                    Тооцоолох
                  </Link>
                </div>
              )}
            </div>

            <div className="d-flex gap-3 mb-5">
              <button 
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0]?.url || "/assets/drone-product.png",
                })}
                disabled={product.stockQty === 0}
                className="btn btn-outline-primary rounded-pill py-3 px-5 fw-bold fs-5 flex-grow-1"
              >
                {product.stockQty === 0 ? "Онцгой захиалгаар" : "Сагсанд нэмэх"}
              </button>
              <Link 
                href="/checkout"
                className="btn btn-primary rounded-pill py-3 px-5 fw-bold fs-5 shadow"
              >
                Шууд авах
              </Link>
            </div>

            {/* Perks */}
            <div className="d-flex flex-column flex-sm-row gap-4 mb-5 border-top border-bottom py-4">
              <div className="d-flex align-items-center gap-3">
                <div className="text-primary"><Shield size={28} /></div>
                <div>
                  <div className="fw-bold text-dark mb-1">Албан ёсны баталгаа</div>
                  <div className="text-secondary" style={{ fontSize: "0.85rem" }}>1 жилийн үйлдвэрийн баталгаатай</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="text-primary"><Truck size={28} /></div>
                <div>
                  <div className="fw-bold text-dark mb-1">Хүргэлт</div>
                  <div className="text-secondary" style={{ fontSize: "0.85rem" }}>УБ хот дотор үнэгүй хүргэлт</div>
                </div>
              </div>
            </div>

            {/* Tech Specs */}
            {product.specs && product.specs.length > 0 && (
              <div>
                <h4 className="fw-bold mb-4" style={{ fontFamily: "var(--font-ui), sans-serif" }}>Гол үзүүлэлтүүд</h4>
                <ul className="list-unstyled">
                  {product.specs?.slice(0, 4).map((spec, i) => (
                    <li key={i} className="d-flex justify-content-between border-bottom py-3">
                      <span className="text-secondary">{spec.label}</span>
                      <span className="fw-medium text-dark">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Detailed description */}
        <div className="row mt-5 pt-5 border-top">
          <div className="col-12 col-md-8 mx-auto text-center">
            <h2 className="mb-4 fw-bold" style={{ fontFamily: "var(--font-ui), sans-serif" }}>Бүтээгдэхүүний тухай</h2>
            <p className="text-secondary fs-5" style={{ lineHeight: "1.8" }}>
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
