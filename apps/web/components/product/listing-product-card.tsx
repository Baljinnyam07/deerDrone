"use client";

import Link from "next/link";
import type { Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";

import Image from "next/image";

export function ListingProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]?.url || "/assets/drone-product.png";

  return (
    <Link href={`/products/${product.slug}`} className="text-decoration-none group d-block mb-4 transition-all">
      <div className="listing-card bg-white rounded-lg overflow-hidden h-100 d-flex flex-column transition-all">
        {/* Image Container with Light Background */}
        <div
          className="position-relative w-100 d-flex align-items-center justify-content-center overflow-hidden"
          style={{
            aspectRatio: "1/1",
            backgroundColor: "#f4f5f6",
            borderRadius: "4px"
          }}
        >
          {/* Brand Logo in Top Right */}
          <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10, opacity: 0.6 }}>
            <span className="fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "#111827" }}>
              {product.brand || "DJI"}
            </span>
          </div>

          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="transition-all group-hover-scale object-fit-cover"
          />
        </div>

        {/* Product Details */}
        <div className="pt-3 pb-2 px-1 text-start">
          <h3 className="fw-bold text-dark mb-1 d-block text-truncate" style={{ fontSize: "0.95rem", lineHeight: "1.2", maxWidth: "100%" }}>
            {product.name}
          </h3>
          <p className="fw-bold text-dark mb-0" style={{ fontSize: "1.05rem" }}>
            {product.price}₮
          </p>
        </div>
      </div>

      <style jsx>{`
        .listing-card:hover {
          transform: translateY(-4px);
        }
        .group-hover-scale {
          transition: transform 0.4s ease-in-out;
        }
        .group:hover .group-hover-scale {
          transform: scale(1.08);
        }
      `}</style>
    </Link>
  );
}
