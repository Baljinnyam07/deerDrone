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
  Star,
  Share2,
} from "lucide-react";
import type { Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import { useStore } from "../../../../store/useStore";
import { useState } from "react";
import { MinimalProductCarousel } from "../../../../components/product/minimal-product-carousel";
import { RatingStars } from "../../../../components";

export default function ProductDetailView({
  product,
  similarProducts = [],
}: {
  product: Product;
  similarProducts?: Product[];
}) {
  const router = useRouter();
  const { addToCart } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("info");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "/assets/drone-product.png", alt: product.name }];
  const imageUrl =
    images[currentImageIndex]?.url || "/assets/drone-product.png";

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
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const incrementQty = () => {
    if (quantity < (product.stockQty || 99)) setQuantity((prev) => prev + 1);
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .product-detail-tabs {
          display: flex;
          gap: 32px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 24px;
        }
        .product-detail-tab {
          padding: 12px 0;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          position: relative;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
        }
        .product-detail-tab:hover {
          color: #0F172A;
        }
        .product-detail-tab.active {
          color: #2563EB;
        }
        .product-detail-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #2563EB;
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
          padding: 14px 24px;
          font-size: 0.95rem;
          color: #475569;
          border-bottom: 1px solid #E2E8F0;
        }
        .spec-row:last-child {
          border-bottom: none;
        }
        .spec-row span:last-child {
          font-weight: 600;
          color: #0F172A;
        }
        .action-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #475569;
          cursor: pointer;
          transition: color 250ms;
          padding: 8px 12px;
          border-radius: 6px;
        }
        .action-link:hover {
          color: #2563EB;
          background-color: #F0F4FF;
        }
      `,
        }}
      />

      {/* Breadcrumb */}
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 32px" }}
      >
        <nav aria-label="breadcrumb" style={{ fontSize: "0.9rem" }}>
          <ol
            style={{
              display: "flex",
              gap: "8px",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li>
              <Link
                href="/"
                style={{ color: "#64748B", textDecoration: "none" }}
              >
                Нүүр
              </Link>
            </li>
            <li style={{ color: "#CBD5E1" }}>/</li>
            <li>
              <Link
                href={`/products?category=${product.categorySlug}`}
                style={{ color: "#64748B", textDecoration: "none" }}
              >
                {product.categoryName}
              </Link>
            </li>
            <li style={{ color: "#CBD5E1" }}>/</li>
            <li style={{ color: "#0F172A", fontWeight: 500 }}>
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px 40px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Gallery */}
          <div>
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                backgroundColor: "#F8FAFC",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src={imageUrl}
                alt={images[currentImageIndex]?.alt || product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={`${img.url}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{
                      flex: "0 0 100px",
                      height: "100px",
                      border:
                        idx === currentImageIndex
                          ? "2px solid #2563EB"
                          : "1px solid #E2E8F0",
                      borderRadius: "8px",
                      backgroundColor: "#F8FAFC",
                      cursor: "pointer",
                      padding: "4px",
                      transition: "all 250ms",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.borderColor = "#2563EB";
                    }}
                    onMouseLeave={(e) => {
                      if (idx !== currentImageIndex) {
                        (e.target as HTMLElement).style.borderColor = "#E2E8F0";
                      }
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "12px",
                }}
              >
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {product.name}
                </h1>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#64748B",
                    fontWeight: 500,
                  }}
                >
                  SKU:{" "}
                  {product.id
                    ? product.id.substring(0, 8).toUpperCase()
                    : "N/A"}
                </span>
              </div>

              {/* Rating and Category */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <RatingStars
                  rating={4.5}
                  reviewCount={28}
                  size="md"
                  showCount={true}
                />
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748B",
                    padding: "4px 12px",
                    backgroundColor: "#F0F4FF",
                    borderRadius: "20px",
                  }}
                >
                  {product.categoryName || "Дрон"}
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div
              style={{
                marginBottom: "24px",
                paddingBottom: "24px",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "#64748B",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Үнэ
              </span>
              <div
                style={{ fontSize: "2rem", fontWeight: 700, color: "#2563EB" }}
              >
                {formatMoney(product.price)}
              </div>
            </div>

            {/* Actions Links */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <div
                className="action-link"
                onClick={() => {}}
                style={{ cursor: "pointer" }}
              >
                <ArrowLeftRight size={18} /> Харьцуулах
              </div>
              <div
                className="action-link"
                onClick={() => {}}
                style={{ cursor: "pointer" }}
              >
                <Share2 size={18} /> Хуваалцах
              </div>
            </div>

            {/* Quantity and Buttons */}
            <div
              style={{
                marginBottom: "24px",
                paddingBottom: "24px",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                }}
              >
                {/* Quantity Control */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#F8FAFC",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <button
                    onClick={decrementQty}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      padding: "12px 16px",
                      cursor: "pointer",
                      color: "#64748B",
                      transition: "color 250ms",
                    }}
                    onMouseEnter={(e: any) =>
                      (e.currentTarget.style.color = "#2563EB")
                    }
                    onMouseLeave={(e: any) =>
                      (e.currentTarget.style.color = "#64748B")
                    }
                  >
                    <Minus size={18} />
                  </button>
                  <div
                    style={{
                      padding: "12px 24px",
                      fontWeight: 600,
                      color: "#0F172A",
                      minWidth: "60px",
                      textAlign: "center",
                    }}
                  >
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQty}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      padding: "12px 16px",
                      cursor: "pointer",
                      color: "#64748B",
                      transition: "color 250ms",
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  style={{
                    border: "1px solid #E2E8F0",
                    backgroundColor: isWishlisted ? "#FEE2E2" : "#FFFFFF",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: isWishlisted ? "#DC2626" : "#64748B",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    transition: "all 250ms",
                  }}
                >
                  <Heart
                    size={18}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />{" "}
                  Wishlist
                </button>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <button
                  onClick={addCurrentProductToCart}
                  disabled={product.stockQty === 0}
                  style={{
                    padding: "12px 24px",
                    border: "1px solid #2563EB",
                    backgroundColor: "#FFFFFF",
                    color: "#2563EB",
                    fontWeight: 600,
                    borderRadius: "8px",
                    cursor: product.stockQty === 0 ? "not-allowed" : "pointer",
                    transition: "all 250ms",
                    fontSize: "0.95rem",
                    opacity: product.stockQty === 0 ? 0.5 : 1,
                  }}
                >
                  Сагсанд хийх
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stockQty === 0}
                  style={{
                    padding: "12px 24px",
                    border: "none",
                    backgroundColor: "#2563EB",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    borderRadius: "8px",
                    cursor: product.stockQty === 0 ? "not-allowed" : "pointer",
                    transition: "all 250ms",
                    fontSize: "0.95rem",
                    opacity: product.stockQty === 0 ? 0.5 : 1,
                  }}
                >
                  Худалдан авах
                </button>
              </div>
            </div>

            {/* Info Messages */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "24px",
                paddingBottom: "24px",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "0.9rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor:
                      product.stockQty > 0 ? "#DCFCE7" : "#FEE2E2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PackageCheck
                    size={18}
                    style={{
                      color: product.stockQty > 0 ? "#16A34A" : "#DC2626",
                    }}
                  />
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>Stock Status: </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: product.stockQty > 0 ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {product.stockQty > 0
                      ? `${product.stockQty} шт нэмэлт`
                      : "Дууссан"}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "0.9rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Truck size={18} style={{ color: "#0284C7" }} />
                </div>
                <div>
                  <span style={{ color: "#0F172A", fontWeight: 500 }}>
                    Үлэнд хүргүүлэлтэнд хамаатай
                  </span>
                </div>
              </div>
            </div>

            {/* Alternative Actions */}
            <div
              style={{
                paddingBottom: "24px",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "#64748B",
                  display: "block",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                Бусад сонголт
              </span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    color: "#475569",
                    cursor: "pointer",
                    transition: "all 250ms",
                  }}
                >
                  💬 Bot-тай сошлох
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    color: "#475569",
                    cursor: "pointer",
                    transition: "all 250ms",
                  }}
                >
                  📞 Лизинг авах
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 32px" }}
      >
        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            marginBottom: "24px",
            color: "#0F172A",
          }}
        >
          Бүтээгдэхүүний үзүүлэлтүүд
        </h2>
        <div
          style={{
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {product.specs && product.specs.length > 0 ? (
            product.specs.map((spec, index) => (
              <div key={`${spec.label}-${index}`} className="spec-row">
                <span>{spec.label}</span>
                <span>{spec.value}</span>
              </div>
            ))
          ) : (
            <>
              <div className="spec-row">
                <span>Разрешение камеры</span>
                <span>4K UHD</span>
              </div>
              <div className="spec-row">
                <span>Время полета</span>
                <span>46 минут</span>
              </div>
              <div className="spec-row">
                <span>Батарея</span>
                <span>5935 мАч</span>
              </div>
              <div className="spec-row">
                <span>Вес</span>
                <span>907 г</span>
              </div>
              <div className="spec-row">
                <span>Дальность связи</span>
                <span>15 км</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 32px" }}
      >
        <div className="product-detail-tabs">
          <div
            className={`product-detail-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Бүтээгдэхүүний мэдээлэл
          </div>
          <div
            className={`product-detail-tab ${activeTab === "stores" ? "active" : ""}`}
            onClick={() => setActiveTab("stores")}
          >
            Худалдаалж буй дэлгүүр
          </div>
          <div
            className={`product-detail-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Хэрэглэгчдийн сэтгэгдэл
          </div>
        </div>

        <div style={{ paddingBottom: "60px" }}>
          {activeTab === "info" && (
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "#475569",
                maxWidth: "100%",
                margin: 0,
              }}
            >
              {product.description ||
                "Бүтээгдэхүүний дэлгэрэнгүй мэдээлэл одоогоор алга байна."}
            </p>
          )}
          {activeTab === "stores" && (
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "#475569",
                margin: 0,
              }}
            >
              Манай албан ёсны салбар дэлгүүрүүдэд бэлэн худалдаалагдаж байна.
            </p>
          )}
          {activeTab === "reviews" && (
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "#475569",
                margin: 0,
              }}
            >
              Сэтгэгдэл байхгүй байна.
            </p>
          )}
        </div>

        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            marginBottom: "24px",
            color: "#0F172A",
          }}
        >
          Төстэй бараа
        </h2>

        {/* Similar Items Carousel */}
        <div style={{ marginBottom: "60px" }}>
          <MinimalProductCarousel products={similarProducts} />
        </div>
      </div>
    </div>
  );
}
