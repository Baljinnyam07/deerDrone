"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, Truck, ShieldCheck, Share2, ChevronRight } from "lucide-react";
import type { Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import { useStore } from "../../../../store/useStore";
import { useEffect, useState } from "react";
import { MinimalProductCarousel } from "../../../../components/product/minimal-product-carousel";
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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "/assets/drone-product.png", alt: product.name }];
  const imageUrl = images[currentImageIndex]?.url || "/assets/drone-product.png";

  const descriptionLines = (product.description || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const groupedSpecs = product.specs?.reduce<Record<string, typeof product.specs>>((acc, spec) => {
    const group = spec.group || "Ерөнхий";
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {}) ?? {};

  async function addCurrentProductToCart() {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-login-modal'));
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: imageUrl, brand: product.brand, stockQty: product.stockQty });
    }
  }

  async function handleBuyNow() {
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-login-modal'));
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: imageUrl, brand: product.brand, stockQty: product.stockQty });
    }
    router.push("/checkout");
  }

  const inStock = product.stockQty > 0;

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link href="/" className="pd-bc-link">Нүүр</Link>
        <ChevronRight size={14} className="pd-bc-sep" />
        <Link href={`/products?category=${product.categorySlug}`} className="pd-bc-link">
          {product.categoryName}
        </Link>
        <ChevronRight size={14} className="pd-bc-sep" />
        <span className="pd-bc-current">{product.name}</span>
      </div>

      {/* Main Grid */}
      <div className="pd-container">
        <div className="pd-grid">

          {/* ── Left: Gallery ── */}
          <div className="pd-gallery">
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pd-thumb ${idx === currentImageIndex ? "pd-thumb-active" : ""}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <Image src={img.url} alt={`${idx + 1}`} fill style={{ objectFit: "contain", padding: "4px" }} />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="pd-main-image">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                style={{ objectFit: "contain", transition: "opacity 200ms" }}
              />
              {/* Stock badge on image */}
              {!inStock && (
                <div className="pd-out-of-stock-badge">Дууссан</div>
              )}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="pd-info">

            {/* Brand + category chips */}
            <div className="pd-chips">
              {product.brand && <span className="pd-chip pd-chip-brand">{product.brand}</span>}
              {product.categoryName && <span className="pd-chip pd-chip-cat">{product.categoryName}</span>}
              {product.isLeasable && <span className="pd-chip pd-chip-lease">Лизингтэй</span>}
            </div>

            {/* Title */}
            <h1 className="pd-title">{product.name}</h1>

            {/* Short description */}
            {product.shortDescription && (
              <p className="pd-short-desc">{product.shortDescription}</p>
            )}

            {/* Price */}
            <div className="pd-price-block">
              <div className="pd-price-main">{formatMoney(product.price)}</div>
              {product.comparePrice && product.comparePrice > product.price && (
                <div className="pd-price-compare-row">
                  <span className="pd-price-compare">{formatMoney(product.comparePrice)}</span>
                  <span className="pd-price-discount">
                    -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className={`pd-stock ${inStock ? "pd-stock-in" : "pd-stock-out"}`}>
              <span className="pd-stock-dot" />
              {inStock ? `Нөөцтэй · ${product.stockQty} ширхэг` : "Нөөц дууссан"}
            </div>

            {/* Quantity */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">Тоо ширхэг</span>
              <div className="pd-qty-ctrl">
                <button className="pd-qty-btn" onClick={() => quantity > 1 && setQuantity(q => q - 1)}>
                  <Minus size={14} />
                </button>
                <span className="pd-qty-val">{quantity}</span>
                <button className="pd-qty-btn" onClick={() => quantity < (product.stockQty || 99) && setQuantity(q => q + 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="pd-cta" style={{ gridTemplateColumns: user ? "1fr 1fr" : "1fr" }}>
              {user && (
                <button
                  className="pd-btn-secondary"
                  disabled={!inStock}
                  onClick={() => void addCurrentProductToCart()}
                >
                  Сагсанд хийх
                </button>
              )}
              <button
                className="pd-btn-primary"
                disabled={!inStock}
                onClick={() => void handleBuyNow()}
              >
                Худалдан авах
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              <div className="pd-trust-item">
                <Truck size={16} />
                <span>Хүргэлт 1–2 хоног</span>
              </div>
              <div className="pd-trust-item">
                <ShieldCheck size={16} />
                <span>Баталгаат бараа</span>
              </div>
              <button
                className="pd-trust-item pd-share-btn"
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              >
                <Share2 size={16} />
                <span>Хуваалцах</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specs */}
      {product.specs && product.specs.length > 0 && (
        <div className="pd-section">
          <div className="pd-section-inner">
            <h2 className="pd-section-title">Техникийн үзүүлэлт</h2>
            <div className="pd-specs-wrap">
              {Object.entries(groupedSpecs).map(([group, specs]) => (
                <div key={group} className="pd-spec-group">
                  {Object.keys(groupedSpecs).length > 1 && (
                    <div className="pd-spec-group-label">{group}</div>
                  )}
                  {specs.map((spec, i) => (
                    <div key={i} className={`pd-spec-row ${i % 2 === 0 ? "pd-spec-even" : ""}`}>
                      <span className="pd-spec-label">{spec.label}</span>
                      <span className="pd-spec-value">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs: description */}
      <div className="pd-section">
        <div className="pd-section-inner">
          <div className="pd-tabs">
            {["info"].map((tab) => (
              <button
                key={tab}
                className={`pd-tab ${activeTab === tab ? "pd-tab-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                Бүтээгдэхүүний тайлбар
              </button>
            ))}
          </div>
          <div className="pd-tab-body">
            {descriptionLines.length > 0 ? (
              descriptionLines.map((line, i) => (
                <p key={i} className="pd-desc-line">{line}</p>
              ))
            ) : (
              <p className="pd-desc-line" style={{ color: "#94A3B8" }}>
                Дэлгэрэнгүй мэдээлэл одоогоор байхгүй байна.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <div className="pd-section">
          <div className="pd-section-inner">
            <h2 className="pd-section-title">Төстэй бараа</h2>
            <MinimalProductCarousel products={similarProducts} />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
  .pd-breadcrumb {
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px 32px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    flex-wrap: wrap;
  }
  .pd-bc-link {
    color: #94A3B8;
    text-decoration: none;
    transition: color 150ms;
  }
  .pd-bc-link:hover { color: #0F172A; }
  .pd-bc-sep { color: #CBD5E1; flex-shrink: 0; }
  .pd-bc-current { color: #0F172A; font-weight: 500; }

  .pd-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px 32px 48px;
  }
  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
  }

  /* Gallery */
  .pd-gallery { display: flex; flex-direction: column; gap: 12px; position: sticky; top: 100px; }
  .pd-thumbs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .pd-thumbs::-webkit-scrollbar { display: none; }
  .pd-thumb {
    flex: 0 0 64px;
    height: 64px;
    position: relative;
    border-radius: 8px;
    border: 1.5px solid #E2E8F0;
    background: #F8FAFC;
    cursor: pointer;
    transition: border-color 150ms;
    overflow: hidden;
    padding: 0;
  }
  .pd-thumb:hover { border-color: #94A3B8; }
  .pd-thumb-active { border-color: #0F172A !important; }
  .pd-main-image {
    width: 100%;
    aspect-ratio: 1;
    background: #F8FAFC;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .pd-out-of-stock-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: #0F172A;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    letter-spacing: 0.04em;
  }

  /* Info */
  .pd-info { display: flex; flex-direction: column; gap: 20px; }

  .pd-chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .pd-chip {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .pd-chip-brand { background: #0F172A; color: #fff; }
  .pd-chip-cat { background: #F1F5F9; color: #475569; }
  .pd-chip-lease { background: #EFF6FF; color: #2563EB; }

  .pd-title {
    font-size: 2rem;
    font-weight: 700;
    color: #0F172A;
    line-height: 1.2;
    letter-spacing: -0.03em;
    margin: 0;
  }
  .pd-short-desc {
    font-size: 0.95rem;
    color: #64748B;
    line-height: 1.65;
    margin: 0;
  }

  .pd-price-block { display: flex; flex-direction: column; gap: 4px; }
  .pd-price-main {
    font-size: 2.2rem;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .pd-price-compare-row { display: flex; align-items: center; gap: 10px; }
  .pd-price-compare {
    font-size: 1rem;
    color: #94A3B8;
    text-decoration: line-through;
  }
  .pd-price-discount {
    font-size: 0.8rem;
    font-weight: 700;
    color: #16A34A;
    background: #DCFCE7;
    padding: 2px 8px;
    border-radius: 20px;
  }

  .pd-stock {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    width: fit-content;
  }
  .pd-stock-in { background: #F0FDF4; color: #16A34A; }
  .pd-stock-out { background: #FEF2F2; color: #DC2626; }
  .pd-stock-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  .pd-qty-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-top: 1px solid #F1F5F9;
    border-bottom: 1px solid #F1F5F9;
  }
  .pd-qty-label { font-size: 0.9rem; font-weight: 600; color: #0F172A; }
  .pd-qty-ctrl {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1.5px solid #E2E8F0;
    border-radius: 10px;
    overflow: hidden;
  }
  .pd-qty-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F8FAFC;
    border: none;
    cursor: pointer;
    color: #475569;
    transition: background 150ms;
  }
  .pd-qty-btn:hover { background: #E2E8F0; }
  .pd-qty-val {
    width: 52px;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 700;
    color: #0F172A;
    border-left: 1.5px solid #E2E8F0;
    border-right: 1.5px solid #E2E8F0;
    line-height: 40px;
  }

  .pd-cta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pd-btn-primary, .pd-btn-secondary {
    padding: 14px;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 200ms;
    border: none;
  }
  .pd-btn-primary:disabled, .pd-btn-secondary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .pd-btn-secondary {
    background: #F1F5F9;
    color: #0F172A;
    border: 1.5px solid #E2E8F0;
  }
  .pd-btn-secondary:hover:not(:disabled) { background: #E2E8F0; }
  .pd-btn-primary {
    background: #0F172A;
    color: #fff;
  }
  .pd-btn-primary:hover:not(:disabled) { background: #1E293B; }

  .pd-trust {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .pd-trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: #475569;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 7px 12px;
  }
  .pd-share-btn {
    cursor: pointer;
    background: #F8FAFC;
    transition: background 150ms;
  }
  .pd-share-btn:hover { background: #E2E8F0; }

  /* Sections */
  .pd-section {
    border-top: 1px solid #F1F5F9;
    padding: 48px 0;
  }
  .pd-section-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .pd-section-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 24px;
    letter-spacing: -0.02em;
  }

  /* Specs */
  .pd-specs-wrap { border: 1.5px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
  .pd-spec-group-label {
    padding: 10px 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94A3B8;
    background: #F8FAFC;
    border-bottom: 1px solid #E2E8F0;
  }
  .pd-spec-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 20px;
    font-size: 0.9rem;
    border-bottom: 1px solid #F1F5F9;
  }
  .pd-spec-row:last-child { border-bottom: none; }
  .pd-spec-even { background: #FAFAFA; }
  .pd-spec-label { color: #64748B; }
  .pd-spec-value { font-weight: 600; color: #0F172A; text-align: right; max-width: 55%; }

  /* Tabs */
  .pd-tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #F1F5F9;
    margin-bottom: 24px;
  }
  .pd-tab {
    padding: 10px 0;
    margin-right: 32px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #94A3B8;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    transition: color 150ms;
  }
  .pd-tab-active { color: #0F172A; }
  .pd-tab-active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #0F172A;
    border-radius: 2px 2px 0 0;
  }
  .pd-tab-body { display: flex; flex-direction: column; gap: 10px; }
  .pd-desc-line { font-size: 0.95rem; line-height: 1.75; color: #475569; margin: 0; }

  @media (max-width: 991px) {
    .pd-breadcrumb { padding: 16px 20px 0; }
    .pd-container { padding: 24px 20px 40px; }
    .pd-grid { grid-template-columns: 1fr; gap: 32px; }
    .pd-gallery { position: static; }
    .pd-title { font-size: 1.5rem !important; }
    .pd-price-main { font-size: 1.8rem !important; }
    .pd-section-inner { padding: 0 20px; }
  }

  @media (max-width: 480px) {
    .pd-cta { grid-template-columns: 1fr; }
    .pd-title { font-size: 1.3rem !important; }
    .pd-price-main { font-size: 1.6rem !important; }
  }
`;
