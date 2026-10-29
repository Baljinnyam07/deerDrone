"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Minus,
  Play,
  Plus,
  Share2,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import type { Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import { useStore } from "../../../../store/useStore";
import { DjProductCard } from "../../../../components/product/dj-product-card";
import {
  getProductMedia,
  mediaSrcSet,
  mediaUrl,
  mediaVideoUrl,
} from "../../../../lib/product-media";

const NAV_LINKS = [
  { id: "features", label: "Онцлох" },
  { id: "gallery", label: "Зураг" },
  { id: "specs", label: "Үзүүлэлт" },
  { id: "similar", label: "Төстэй бараа" },
];

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

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
  const [filmOpen, setFilmOpen] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "/assets/drone-product.png", alt: product.name }];
  const heroImage = (
    product.images?.find((img) => img.isThumbnail) ?? images[0]
  ).url;
  const buyImage = images[currentImageIndex]?.url || heroImage;

  const features = (product.description || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•·\-–*]+/, "").trim())
    .filter(Boolean)
    .slice(0, 8);

  const groupedSpecs =
    product.specs?.reduce<Record<string, typeof product.specs>>((acc, spec) => {
      const group = spec.group || "Ерөнхий";
      (acc[group] ??= []).push(spec);
      return acc;
    }, {}) ?? {};
  const specGroups = Object.entries(groupedSpecs);

  const media = getProductMedia(product.slug, product.categorySlug);
  // Pages without a long film play their hero clip in the viewer.
  const youtubeId = media?.youtube;
  const filmId = media?.film ?? media?.heroVideo?.id;
  const hasFilm = !!(youtubeId || filmId);

  useEffect(() => {
    if (!filmOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setFilmOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [filmOpen]);

  // The hero loop would keep playing behind the viewer; pause it while the film is open.
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (filmOpen) video.pause();
    else video.play().catch(() => {});
  }, [filmOpen]);
  const inStock = product.stockQty > 0;
  const onSale = !!product.comparePrice && product.comparePrice > product.price;

  const navLinks = NAV_LINKS.filter((link) => {
    if (link.id === "features") return !!media || features.length > 0;
    if (link.id === "gallery")
      return media ? media.gallery.length > 0 : images.length > 1;
    if (link.id === "specs") return !media && specGroups.length > 0;
    if (link.id === "similar") return !media && similarProducts.length > 0;
    return true;
  });

  function openBuy() {
    // Rich pages are for browsing; purchasing happens on the classic product page.
    if (media) router.push(`/products/${product.slug}/buy`);
    else scrollToSection("buy");
  }

  function addCurrentProductToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: buyImage,
        brand: product.brand,
        stockQty: product.stockQty,
        categorySlug: product.categorySlug,
      });
    }
  }

  function handleBuyNow() {
    addCurrentProductToCart();
    router.push("/checkout");
  }

  return (
    <div className="dp">
      {/* Sticky product sub-nav */}
      <div className="dp-subnav">
        <div className="dp-subnav-inner">
          <span className="dp-subnav-name" title={product.name.trim()}>
            {product.name.replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim()}
          </span>
          <nav className="dp-subnav-links" aria-label="Хуудасны хэсгүүд">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="dp-pill dp-pill-sm"
            onClick={openBuy}
          >
            Худалдан авах
          </button>
        </div>
      </div>

      {/* Hero */}
      <section
        className={`dp-hero${media ? " dp-hero-kv" : ""}${media?.heroVideo || media?.heroDark ? " has-video" : ""}${media?.heroDark && !media.heroVideo ? " is-still" : ""}`}
        style={
          media
            ? {
                backgroundImage: `url(${mediaUrl(media.folder, media.heroVideo?.poster ?? media.hero.id, 2400)})`,
              }
            : undefined
        }
        aria-label={media?.hero.alt}
      >
        {media?.heroDark && !media.heroVideo && (
          <div className="dp-hero-scrim" aria-hidden="true" />
        )}
        {media?.heroVideo && (
          <>
            <video
              ref={heroVideoRef}
              className="dp-hero-video"
              src={mediaVideoUrl(media.folder, media.heroVideo.id)}
              poster={mediaUrl(media.folder, media.heroVideo.poster, 1600)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
            <div className="dp-hero-scrim" aria-hidden="true" />
          </>
        )}
        <h1 className="dp-hero-title">{product.name.trim()}</h1>
        {product.shortDescription &&
          product.shortDescription.trim() !== product.name.trim() && (
            <p className="dp-hero-tagline">{product.shortDescription}</p>
          )}
        <div className="dp-hero-actions">
          {(media || inStock) && (
            <button type="button" className="dp-pill" onClick={openBuy}>
              Худалдан авах
            </button>
          )}
          {hasFilm ? (
            <button
              type="button"
              className="dp-pill dp-pill-outline"
              onClick={() => setFilmOpen(true)}
            >
              <Play size={14} fill="currentColor" /> Бичлэг үзэх
            </button>
          ) : (
            !media &&
            specGroups.length > 0 && (
              <button
                type="button"
                className="dp-text-link"
                onClick={() => scrollToSection("specs")}
              >
                Үзүүлэлт <ChevronRight size={16} />
              </button>
            )
          )}
        </div>
        {media ? null : (
          <div className="dp-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt={product.name} className="dj-cutout" />
            {!inStock && <span className="dp-soldout">Дууссан</span>}
          </div>
        )}
      </section>

      {/* Chapters: dji.com-style text-over-image sections */}
      {media && (
        <div id="features">
          {media.chapters.map((chapter, i) => (
            <section
              key={chapter.title}
              className={`dp-chapter${i % 2 === 1 ? " is-soft" : ""}`}
            >
              <div className="dp-chapter-head">
                <h2>{chapter.title}</h2>
                <p>{chapter.text}</p>
              </div>
              <div
                className={`dp-chapter-media${chapter.images.length > 1 ? " is-pair" : ""}`}
              >
                {chapter.images.map((img) => (
                  <figure key={img.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl(media.folder, img.id, 1400)}
                      srcSet={mediaSrcSet(media.folder, img.id)}
                      sizes={
                        chapter.images.length > 1
                          ? "(min-width: 1200px) 600px, 92vw"
                          : "(min-width: 1440px) 1392px, 96vw"
                      }
                      alt={img.alt}
                      loading="lazy"
                    />
                    {img.caption && <figcaption>{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* "Shot on" sample gallery */}
      {media && media.gallery.length > 0 && (
        <section id="gallery" className="dp-section dp-section-dark">
          <div className="dp-wrap">
            <h2 className="dp-h2">{media.galleryTitle}</h2>
          </div>
          <div className="dp-strip dp-strip-photos">
            {media.gallery.map((img) => (
              <div key={img.id} className="dp-strip-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(media.folder, img.id, 1200)}
                  srcSet={mediaSrcSet(media.folder, img.id, [600, 1200, 1800])}
                  sizes="(min-width: 768px) 640px, 84vw"
                  alt={img.alt}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features from the description */}
      {!media && features.length > 0 && (
        <section id="features" className="dp-section">
          <div className="dp-wrap">
            <h2 className="dp-h2">Онцлох шинж чанар</h2>
            <div className="dp-features">
              {features.map((text, i) => (
                <article key={i} className="dp-feature">
                  <span className="dp-feature-no">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image strip */}
      {!media && images.length > 1 && (
        <section id="gallery" className="dp-section dp-section-soft">
          <div className="dp-wrap">
            <h2 className="dp-h2">Зураг</h2>
          </div>
          <div className="dp-strip">
            {images.map((img, i) => (
              <div key={i} className="dp-strip-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || `${product.name} ${i + 1}`}
                  className="dj-cutout"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Purchase */}
      {!media && (
        <section id="buy" className="dp-section">
          <div className="dp-wrap dp-buy">
            <div className="dp-buy-media">
              <div className="dp-buy-main">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={buyImage} alt={product.name} className="dj-cutout" />
              </div>
              {images.length > 1 && (
                <div className="dp-thumbs">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      className={i === currentImageIndex ? "is-active" : ""}
                      onClick={() => setCurrentImageIndex(i)}
                      aria-label={`Зураг ${i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt=""
                        className="dj-cutout"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dp-buy-info">
              <h2 className="dp-buy-title">{product.name.trim()}</h2>
              <div className="dp-buy-price">
                <strong>{formatMoney(product.price)}</strong>
                {onSale && <s>{formatMoney(product.comparePrice!)}</s>}
              </div>
              <div className={`dp-stock ${inStock ? "is-in" : "is-out"}`}>
                <span />
                {inStock
                  ? `Нөөцтэй · ${product.stockQty} ширхэг`
                  : "Нөөц дууссан"}
              </div>

              <div className="dp-qty-row">
                <span>Тоо ширхэг</span>
                <div className="dp-qty">
                  <button
                    type="button"
                    aria-label="Хасах"
                    onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    aria-label="Нэмэх"
                    onClick={() =>
                      quantity < (product.stockQty || 99) &&
                      setQuantity((q) => q + 1)
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="dp-buy-actions">
                <button
                  type="button"
                  className="dp-pill"
                  disabled={!inStock}
                  onClick={handleBuyNow}
                >
                  Худалдан авах
                </button>
                <button
                  type="button"
                  className="dp-pill dp-pill-ghost"
                  disabled={!inStock}
                  onClick={addCurrentProductToCart}
                >
                  Сагсанд хийх
                </button>
              </div>

              <ul className="dp-trust">
                <li>
                  <Truck size={16} /> Хүргэлт 24 цаг
                </li>
                <li>
                  <ShieldCheck size={16} /> Баталгаат бараа
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.share?.({
                        title: product.name,
                        url: window.location.href,
                      })
                    }
                  >
                    <Share2 size={16} /> Хуваалцах
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Specs */}
      {!media && specGroups.length > 0 && (
        <section id="specs" className="dp-section dp-section-soft">
          <div className="dp-wrap">
            <h2 className="dp-h2">Техникийн үзүүлэлт</h2>
            <div className="dp-specs">
              {specGroups.map(([group, specs]) => (
                <div key={group} className="dp-spec-group">
                  <h3>{group}</h3>
                  <dl>
                    {specs.map((spec, i) => (
                      <div key={i} className="dp-spec-row">
                        <dt>{spec.label}</dt>
                        <dd>{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Similar products */}
      {!media && similarProducts.length > 0 && (
        <section id="similar" className="dp-section">
          <div className="dp-wrap">
            <h2 className="dp-h2">Төстэй бараа</h2>
          </div>
          <div className="dj-product-grid dp-similar">
            {similarProducts.slice(0, 4).map((item) => (
              <DjProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
      {media && hasFilm && filmOpen && (
        <div
          className="dp-film"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} — бичлэг`}
          onClick={() => setFilmOpen(false)}
        >
          <button
            type="button"
            className="dp-film-close"
            aria-label="Хаах"
            onClick={() => setFilmOpen(false)}
          >
            <X size={22} />
          </button>
          {youtubeId ? (
            <iframe
              className="dp-film-frame"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title={`${product.name} — бичлэг`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              className="dp-film-video"
              src={mediaVideoUrl(media.folder, filmId!)}
              poster={
                media.heroVideo
                  ? mediaUrl(media.folder, media.heroVideo.poster, 1600)
                  : undefined
              }
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}
