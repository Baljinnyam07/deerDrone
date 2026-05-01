"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@deer-drone/types";
import Image from "next/image";
import { Eye, ShoppingCart } from "lucide-react";
import { formatMoney } from "@deer-drone/utils";
import { useStore } from "../../store/useStore";
import { createClient } from "../../lib/supabase/client";

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
  const router = useRouter();
  const addToCart = useStore((state) => state.addToCart);

  const imageUrl = product.images?.[0]?.url || "/assets/drone-product.png";

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  async function addCurrentProductToCart() {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-login-modal'));
      return;
    }

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: imageUrl,
      brand: product.brand,
      stockQty: product.stockQty,
    });
  }

  return (
    <div className="product-card-premium-wrapper">
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
        {/* Hover Action Buttons — card level, top-right */}
        <div className="product-card-actions">
          <button
            className="action-circle action-circle-view"
            title="Харах"
            onClick={() => router.push(`/products/${product.slug}`)}
          >
            <Eye size={16} />
          </button>
          {user && (
            <button
              className="action-circle action-circle-cart"
              title="Сагслах"
              onClick={() => void addCurrentProductToCart()}
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="text-decoration-none"
        >
          <div
            className="bg-light rounded-top-4 product-card-image-container"
            style={{ height: "260px", position: "relative", overflow: "hidden" }}
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="product-card-image"
              style={{ objectFit: "contain", padding: "16px", transition: "transform 250ms cubic-bezier(0.4,0,0.2,1)" }}
            />
          </div>
        </Link>

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
          <Link href={`/products/${product.slug}`} className="text-decoration-none">
            <h3 className="product-name">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="price-section">
            <span className="price-label">Үнэ</span>
            <span className="price-text">{formatMoney(product.price)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card-premium:hover {
          transform: translateY(-4px);
          border-color: #cbd5e1;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }

        .product-card-premium:hover .product-card-image {
          transform: scale(1.06);
        }

        /* Action circles — fade+scale in from top-right on hover */
        .product-card-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 6px;
          opacity: 0;
          transform: scale(0.75);
          transform-origin: top right;
          transition: opacity 200ms ease,
                      transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .product-card-premium:hover .product-card-actions {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .action-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          transition: transform 150ms, box-shadow 150ms;
        }

        .action-circle:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        }

        .action-circle-view {
          background: rgba(255, 255, 255, 0.95);
          color: #0F172A;
          backdrop-filter: blur(6px);
        }

        .action-circle-cart {
          background: #0F172A;
          color: #FFFFFF;
        }

        .product-name {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #0F172A;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .price-section {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .price-label {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94A3B8;
        }

        .price-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.02em;
          line-height: 1.2;
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
          /* Mobile: always visible */
          .product-card-actions {
            opacity: 1 !important;
            transform: scale(1) !important;
            pointer-events: auto !important;
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
          .action-circle {
            width: 34px !important;
            height: 34px !important;
          }
        }
      `}</style>
    </div>
  );
}
