"use client";

import Link from "next/link";
import { Star, ShoppingCart, Heart, Sparkles } from "lucide-react";
import type { Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";

interface ProductCardProps {
  product: Product;
}

import Image from "next/image";

export function ProductCard({ product }: ProductCardProps) {
  const isNew = parseInt(product.id, 10) > 5;
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="text-decoration-none d-block group">
      <div
        className="bg-white rounded-4 overflow-hidden h-100 position-relative product-card-premium"
        style={{
          border: "2px solid #f3f4f6",
        }}
      >
        {/* Badges */}
        <div className="position-absolute top-0 start-0 w-100 p-3" style={{ zIndex: 10 }}>
          <div className="d-flex gap-2">
            {hasDiscount && (
              <span
                className="badge rounded-pill text-white fw-semibold small"
                style={{ backgroundColor: "#ef4444", padding: "6px 12px" }}
              >
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          className="position-absolute top-0 end-0 btn btn-light rounded-circle m-3 d-flex align-items-center justify-content-center shadow-sm product-card-wishlist"
          style={{ width: "40px", height: "40px", zIndex: 10 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle wishlist logic here
          }}
        >
          <Heart size={18} className="text-secondary" />
        </button>

        {/* Product Image */}
        <div
          className="bg-light rounded-top-4 overflow-hidden d-flex align-items-center justify-content-center p-4 product-card-image-container position-relative"
          style={{ height: "260px" }}
        >
          <Image
            src={product.images?.[0]?.url || "/assets/drone-product.png"}
            alt={product.name}
            fill
            className="img-fluid object-fit-cover p-4 product-card-image"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="mb-2">
            <span className="text-uppercase small fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.08em", color: "#7c3aed" }}>
              {product.categoryName || "Featured"}
            </span>
          </div>

          {/* Title */}
          <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "1.05rem", lineHeight: 1.3, minHeight: "2.6em" }}>
            {product.name}
          </h5>

          {/* Description */}
          <p className="text-secondary small mb-3" style={{ lineHeight: 1.5, minHeight: "3em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.shortDescription}
          </p>

          {/* Rating (placeholder) */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="d-flex gap-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} className="text-warning" fill="currentColor" />
              ))}
            </div>
            <span className="text-secondary small">(4.8)</span>
          </div>

          {/* Price & CTA */}
          <div className="d-flex justify-content-between align-items-center pt-3 product-card-footer">
            <div>
              <div className="fw-bold fs-5 product-price">
                {formatMoney(product.price)}
              </div>
              {hasDiscount && (
                <div className="text-decoration-line-through text-secondary small">
                  {formatMoney(product.comparePrice!)}
                </div>
              )}
            </div>

            <div
              className="rounded-3 d-flex align-items-center justify-content-center product-cart-icon"
              style={{ width: "40px", height: "40px", backgroundColor: "#7c3aed" }}
            >
              <ShoppingCart size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
