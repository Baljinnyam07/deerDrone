"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ArrowLeftRight,
  Copy,
  Minus,
  Plus,
  Truck,
  PackageCheck,
  Star
} from "lucide-react";
import type { Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import { useStore } from "../../../../store/useStore";
import { useState } from "react";
import { MinimalProductCarousel } from "../../../../components/product/minimal-product-carousel";

export default function ProductDetailView({
  product,
  similarProducts = []
}: {
  product: Product;
  similarProducts?: Product[];
}) {
  const router = useRouter();
  const { addToCart } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("info");

  const images = product.images?.length > 0 ? product.images : [{ url: "/assets/drone-product.png", alt: product.name }];
  const imageUrl = images[currentImageIndex]?.url || "/assets/drone-product.png";

  function addCurrentProductToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: imageUrl,
      });
    }
  }

  function handleBuyNow() {
    addCurrentProductToCart();
    router.push("/checkout");
  }

  const decrementQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const incrementQty = () => {
    if (quantity < (product.stockQty || 99)) setQuantity(prev => prev + 1);
  };

  return (
    <div className="bg-white pb-5">
      <style dangerouslySetInnerHTML={{
        __html: `
        .xgimi-tabs {
          display: flex;
          gap: 32px;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 24px;
        }
        .xgimi-tab {
          padding: 12px 0;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        .xgimi-tab:hover {
          color: #111827;
        }
        .xgimi-tab.active {
          color: #111827;
        }
        .xgimi-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #10b981;
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
          padding: 14px 24px;
          font-size: 0.85rem;
        }
        .spec-row:nth-child(even) {
          background-color: #f9fafb;
        }
        .action-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #4b5563;
          cursor: pointer;
          transition: color 0.2s;
        }
        .action-link:hover {
          color: #111827;
        }
      `}} />

      {/* Breadcrumb */}
      <div className="container py-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-10" style={{ fontSize: "0.85rem" }}>
            <li className="breadcrumb-item">
              <Link href="/" className="text-secondary text-decoration-none">Нүүр</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/products?category=${product.categorySlug}`} className="text-secondary text-decoration-none">
                {product.categoryName}
              </Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container pb-5">
        <div className="row g-5">
          {/* Left Column: Gallery */}
          <div className="col-12 col-md-6 col-lg-5">
            <div
              className="w-100 position-relative d-flex align-items-center justify-content-center mb-3"
            >
              <img
                src={imageUrl}
                alt={images[currentImageIndex]?.alt || product.name}
                className="w-100 h-100 rounded-2xl transition-all"
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {images.map((img, idx) => (
                  <button
                    key={`${img.url}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className="flex-shrink-0 bg-white p-1"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: idx === currentImageIndex
                        ? "1.5px solid #10b981"
                        : "1px solid #e5e7eb",
                      cursor: "pointer",
                      borderRadius: "2px"
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: "contain" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="col-12 col-md-6 col-lg-7 d-flex flex-column pt-2">

            <div className="d-flex justify-content-between align-items-start mb-1">
              <h1 className="fw-bold mb-0" style={{ fontSize: "1.75rem", letterSpacing: "-0.01em", color: "#111827" }}>
                {product.name}
              </h1>
              {/* Brand Logo Placeholder */}
              <div className="text-secondary fw-bold" style={{ fontSize: "1.2rem", letterSpacing: "0.1em" }}>
                {product.brand || "XGIMI"}
              </div>
            </div>

            <div className="d-flex flex-column gap-1 mb-4 border-bottom pb-4">
              <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                #{product.id ? product.id.substring(0, 8).toUpperCase() : "10370017"}
              </span>
            </div>

            {/* Price Block */}
            <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-4">
              <div>
                <span className="text-secondary d-block mb-1" style={{ fontSize: "1.2rem" }}>Үнэ</span>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="fw-bold text-dark" style={{ fontSize: "1.8rem" }}>
                    {formatMoney(product.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Links */}
            <div className="d-flex gap-4 mb-4">
              <div className="action-link">
                <ArrowLeftRight size={16} /> Харьцуулах
              </div>
              <div className="action-link">
                <Copy size={16} /> Төстэй бараа
              </div>
            </div>

            {/* Buy Row */}
            <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom flex-wrap">
              <div className="d-flex align-items-center bg-light rounded" style={{ height: "48px" }}>
                <button
                  onClick={decrementQty}
                  className="btn border-0 py-0 px-3 h-100 text-secondary"
                  style={{ backgroundColor: "#f3f4f6" }}
                  type="button"
                >
                  <Minus size={16} />
                </button>
                <div className="d-flex align-items-center justify-content-center bg-dark text-white fw-medium h-100 px-3" style={{ minWidth: "40px" }}>
                  {quantity}
                </div>
                <button
                  onClick={incrementQty}
                  className="btn border-0 py-0 px-3 h-100 text-secondary"
                  style={{ backgroundColor: "#f3f4f6" }}
                  type="button"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={addCurrentProductToCart}
                disabled={product.stockQty === 0}
                className="btn flex-grow-1 fw-bold"
                style={{
                  height: "48px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  opacity: product.stockQty === 0 ? 0.5 : 1
                }}
                type="button"
              >
                Сагсанд хийх
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stockQty === 0}
                className="btn flex-grow-1 fw-bold text-white"
                style={{
                  height: "48px",
                  backgroundColor: "#000000",
                  border: "1px solid #000000",
                  opacity: product.stockQty === 0 ? 0.5 : 1
                }}
                type="button"
              >
                Худалдан авах
              </button>
            </div>

            {/* Info Messages */}
            <div className="d-flex flex-column gap-2 mb-4 pb-4 border-bottom">
              <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.85rem" }}>
                <PackageCheck size={16} className="text-secondary" />
                <span className="text-secondary">Үлдэгдэл:</span>
                <span className="fw-bold" style={{ color: product.stockQty > 0 ? "#10b981" : "#ef4444" }}>
                  {product.stockQty > 0 ? "Боломжтой" : "Дууссан"}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.85rem" }}>
                <Truck size={16} className="text-secondary" />
                <span className="text-dark">Бүх бэлэн бараа хүргэгдэнэ</span>
              </div>
            </div>

            {/* Payment Methods Placeholder */}
            <div>
              <div className="text-secondary mb-3" style={{ fontSize: "0.85rem" }}>
                Төлбөрийн нөхцөлүүд
              </div>
              <div className="d-flex gap-2">
                <img src="https://storepay.mn/logo/storepay-icon.svg" style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#000" }} />
                <div className="rounded-circle bg-info d-flex align-items-center justify-content-center text-white" style={{ width: "24px", height: "24px", fontSize: "10px", fontWeight: "bold" }}>P</div>
                <div className="rounded-circle bg-success d-flex align-items-center justify-content-center text-white" style={{ width: "24px", height: "24px", fontSize: "10px", fontWeight: "bold" }}>S</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="container pb-5">
        <h5 className="fw-bold mb-4" style={{ fontSize: "1rem" }}>
          Бүтээгдэхүүний үзүүлэлтүүд
        </h5>
        <div className="d-flex flex-column w-100" style={{ maxWidth: "100%" }}>
          {product.specs && product.specs.length > 0 ? (
            product.specs.map((spec, index) => (
              <div key={`${spec.label}-${index}`} className="spec-row">
                <span style={{ color: "#4b5563" }}>{spec.label}</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>{spec.value}</span>
              </div>
            ))
          ) : (
            // Dummy Specifications if empty
            <>
              <div className="spec-row">
                <span style={{ color: "#4b5563" }}>Нягтаршил</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>1080p HD</span>
              </div>
              <div className="spec-row">
                <span style={{ color: "#4b5563" }}>Гэрэлтэлт</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>400 ISO Lumens</span>
              </div>
              <div className="spec-row">
                <span style={{ color: "#4b5563" }}>Lamp life</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>25000 hours</span>
              </div>
              <div className="spec-row">
                <span style={{ color: "#4b5563" }}>Чанга яригч</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>Dolby</span>
              </div>
              <div className="spec-row">
                <span style={{ color: "#4b5563" }}>Жин</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>1.18кг</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs and Similar Items */}
      <div className="container">
        <div className="xgimi-tabs">
          <div
            className={`xgimi-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Бүтээгдэхүүний мэдээлэл
          </div>
          <div
            className={`xgimi-tab ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            Худалдаалж буй дэлгүүр
          </div>
          <div
            className={`xgimi-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Хэрэглэгчдийн сэтгэгдэл
          </div>
        </div>

        <div className="tab-content mb-5">
          {activeTab === 'info' && (
            <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "1200px" }}>
              {product.description || "Бүтээгдэхүүний дэлгэрэнгүй мэдээлэл одоогоор алга байна."}
            </p>
          )}
          {activeTab === 'stores' && (
            <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
              Манай албан ёсны салбар дэлгүүрүүдэд бэлэн худалдаалагдаж байна.
            </p>
          )}
          {activeTab === 'reviews' && (
            <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
              Сэтгэгдэл байхгүй байна.
            </p>
          )}
        </div>

        <h5 className="fw-bold mb-4" style={{ fontSize: "1rem" }}>
          Төстэй бараа
        </h5>

        {/* Similar Items rendered by previously created ProductCarousel */}
        <div className="w-100 mb-5">
          <MinimalProductCarousel products={similarProducts} />
        </div>
      </div>
    </div>
  );
}
