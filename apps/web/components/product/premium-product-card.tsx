"use client";

import Link from "next/link";
import type { Product } from "@deer-drone/types";
import Image from "next/image";
import { formatMoney } from "@deer-drone/utils";

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

  return (
    <Link
      href={`/products/${product.slug}`}
      className="text-decoration-none group d-block"
    >
      <div
        className="product-card-premium"
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
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="product-image"
            style={{
              objectFit: "contain",
              transition: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        {/* Content Container */}
        <div
          className="padding-container"
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: "12px",
            padding: "20px",
          }}
        >
          {/* Product Name */}
          <h3
            className="product-name"
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

          {/* Price Section */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "end", gap: "8px", justifyContent: "end" }}>
              <span
                className="price-text"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {formatMoney(product.price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card-premium:hover {
          transform: translateY(-4px);
          border-color: #cbd5e1;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }

        .product-card-premium:hover .product-image {
          transform: scale(1.06);
        }

        @media (max-width: 768px) {
          .product-card-premium {
            border-radius: 12px !important;
          }
          .padding-container {
            padding: 14px !important;
          }
          .product-name {
            font-size: 0.88rem !important;
            margin-bottom: 2px !important;
          }
          .price-text {
            font-size: 1rem !important;
          }
          .product-card-premium:hover {
            transform: none !important;
            box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.05) !important;
          }
        }

        @media (max-width: 480px) {
          .padding-container {
            padding: 10px !important;
          }
          .product-name {
            font-size: 0.82rem !important;
          }
          .price-text {
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </Link>
  );
}
