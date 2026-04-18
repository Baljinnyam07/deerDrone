"use client";

import Link from "next/link";
import Image from "next/image";
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
import { createClient } from "../../../../lib/supabase/client";

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
  const descriptionLines = (product.description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "/assets/drone-product.png", alt: product.name }];
  const imageUrl =
    images[currentImageIndex]?.url || "/assets/drone-product.png";

  async function addCurrentProductToCart() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Not logged in — send to facebook directly, come back to cart after
      window.location.href = "/api/auth/facebook?redirect=/cart";
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: imageUrl,
      });
    }
    // Navigate to cart after adding
    router.push("/cart");
  }

  async function handleBuyNow() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/api/auth/facebook?redirect=/cart";
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: imageUrl,
      });
    }
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
        .product-detail-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px 40px;
        }
        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .breadcrumb-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 32px;
        }
        .spec-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 32px;
        }
        .tabs-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 32px;
        }
        .quantity-actions-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 991px) {
          .product-detail-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .product-detail-container, .breadcrumb-container, .spec-container, .tabs-section {
            padding: 20px 16px;
          }
          .quantity-actions-container {
            grid-template-columns: 1fr;
          }
          .product-detail-title {
            font-size: 1.5rem !important;
          }
          .product-detail-price {
            font-size: 1.5rem !important;
          }
          .product-detail-tabs {
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 4px;
            gap: 20px !important;
          }
          .product-detail-tab {
            font-size: 0.85rem !important;
          }
        }

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
        @media (max-width: 600px) {
          .spec-row {
            flex-direction: column;
            gap: 4px;
            padding: 12px 16px;
          }
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
      <div className="breadcrumb-container">
        <nav aria-label="breadcrumb" style={{ fontSize: "0.9rem" }}>
          <ol
            style={{
              display: "flex",
              gap: "8px",
              listStyle: "none",
              padding: 0,
              margin: 0,
              flexWrap: "wrap",
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

      <div className="product-detail-container">
        <div className="product-detail-grid">
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
              <Image
                src={imageUrl}
                alt={images[currentImageIndex]?.alt || product.name}
                fill
                priority
                style={{
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
                      flex: "0 0 80px",
                      height: "80px",
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
                  >
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>
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
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <h1
                  className="product-detail-title"
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
                    fontSize: "0.85rem",
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
                className="product-detail-price"
                style={{ fontSize: "2rem", fontWeight: 700, color: "#2563EB" }}
              >
                {formatMoney(product.price)}
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
                      padding: "10px 14px",
                      cursor: "pointer",
                      color: "#64748B",
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <div
                    style={{
                      padding: "10px 16px",
                      fontWeight: 600,
                      color: "#0F172A",
                      minWidth: "50px",
                      textAlign: "center",
                      fontSize: "0.95rem",
                    }}
                  >
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQty}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      padding: "10px 14px",
                      cursor: "pointer",
                      color: "#64748B",
                    }}
                  >
                    <Plus size={16} />
                  </button>
                  
                </div>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div className="quantity-actions-container">
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
                  justifyContent: "space-between",
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
                  <span style={{ color: "#64748B" }}>Барааны үлдэгдэл: </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: product.stockQty > 0 ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {product.stockQty > 0
                      ? `${product.stockQty} ширхэг`
                      : "Дууссан"}
                  </span>
                </div>
                </div>
                
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <div
                className="action-link"
                onClick={() => {}}
                style={{ cursor: "pointer" }}
              >
                <Share2 size={18} /> Хуваалцах
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      {product.specs && product.specs.length > 0 && (
        <div className="spec-container">
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
            {product.specs.map((spec, index) => (
              <div key={`${spec.label}-${index}`} className="spec-row">
                <span>{spec.label}</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="tabs-section">
        <div className="product-detail-tabs">
          <div
            className={`product-detail-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Бүтээгдэхүүний мэдээлэл
          </div>
        </div>

        <div style={{ paddingBottom: "60px" }}>
          {activeTab === "info" && (
            <div
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "#475569",
                maxWidth: "100%",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {descriptionLines.length > 0 ? (
                descriptionLines.map((line, index) => (
                  <p key={`${line}-${index}`} style={{ margin: 0 }}>
                    {line}
                  </p>
                ))
              ) : (
                <p style={{ margin: 0 }}>
                  Бүтээгдэхүүний дэлгэрэнгүй мэдээлэл одоогоор алга байна.
                </p>
              )}
            </div>
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
