"use client";

import Link from "next/link";
import type { Product } from "@deer-drone/types";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { RatingStars } from "../ui/rating-stars";
import { ProductBadge } from "../ui/product-badge";

interface PremiumProductCardProps {
  product: Product;
  badge?: "new" | "sale" | "best-seller";
  discount?: number;
  rating?: number;
  reviewCount?: number;
}

export function PremiumProductCard({
  product,
  badge,
  discount,
  rating = 4.5,
  reviewCount = 24,
}: PremiumProductCardProps) {
  const imageUrl = product.images?.[0]?.url || "/assets/drone-product.png";
  const [showQuickView, setShowQuickView] = useState(false);
  const [isWishlisted_local, setIsWishlisted_local] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted_local(!isWishlisted_local);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="text-decoration-none group d-block"
    >
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
          transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
        className="product-card-premium"
      >
        {/* Image Container */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1/1",
            overflow: "hidden",
            backgroundColor: "#F8FAFC",
            width: "100%",
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          {/* Badge - Top Left */}
          {badge && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                zIndex: 10,
              }}
            >
              <ProductBadge type={badge} discount={discount} />
            </div>
          )}

          {/* Wishlist Button - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlistToggle();
            }}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 15,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 150ms ease",
              backdropFilter: "blur(10px)",
            }}
            className="wishlist-btn"
            title="Add to wishlist"
          >
            <Heart
              size={20}
              style={{
                color: isWishlisted_local ? "#EF4444" : "#94A3B8",
                fill: isWishlisted_local ? "#EF4444" : "none",
                transition: "all 150ms ease",
              }}
            />
          </button>

          {/* Image */}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="product-image"
            style={{
              padding: "24px",
              objectFit: "contain",
              transition: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Quick View Button - Appears on Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0,
              transition: "all 150ms ease",
            }}
            className="quick-view-btn"
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              <Eye size={16} />
              Quick View
            </div>
          </button>
        </div>

        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: "12px",
            padding: "20px",
          }}
        >
          {/* Category Label */}
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#94A3B8",
            }}
          >
            {product.categoryName || "Uncategorized"}
          </span>

          {/* Product Name */}
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0F172A",
              lineHeight: "1.4",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ marginTop: "4px" }}>
            <RatingStars
              rating={rating}
              reviewCount={reviewCount}
              size="sm"
              showCount={true}
            />
          </div>

          {/* Description (Optional) */}
          {product.shortDescription && (
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#94A3B8",
                lineHeight: "1.5",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.shortDescription}
            </p>
          )}

          {/* Price Section - Grows to bottom */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {product.price}₮
              </span>
              {discount && (
                <span
                  style={{
                    fontSize: "0.9rem",
                    textDecoration: "line-through",
                    color: "#94A3B8",
                  }}
                >
                  {Math.round((product.price as any) / (1 - discount / 100))}₮
                </span>
              )}
            </div>

            {/* Stock Status */}
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#10B981",
              }}
            >
              ✓ In Stock
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card-premium:hover {
          transform: translateY(-4px);
          border-color: #f1f5f9;
          box-shadow:
            0 10px 15px -3px rgba(15, 23, 42, 0.1),
            0 4px 6px -4px rgba(15, 23, 42, 0.05);
        }

        .product-card-premium:hover .product-image {
          transform: scale(1.08);
        }

        .product-card-premium:hover .quick-view-btn {
          opacity: 1;
          transform: translateX(-50%) translateY(-8px);
        }

        .wishlist-btn:hover {
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Link>
  );
}
