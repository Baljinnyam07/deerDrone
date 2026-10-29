import Link from "next/link";
import { ChevronRight, MapPin, Phone, Truck } from "lucide-react";
import { getProducts, getCategories } from "../lib/supabase/queries";
import { resolveSeries, SHOT_ON_VIDEOS } from "../lib/showcase";
import { HeroSection } from "../components/home/hero-section";
import { ProductBannerGrid } from "../components/home/product-banner-grid";
import { ShotOnCarousel } from "../components/home/shot-on-carousel";

const HERO_SLIDE_COUNT = 4;

const FIELDS = [
  { slug: "drones", title: "Дрон", text: "Аэро зураг авалтаас мэргэжлийн кино бүтээл хүртэл" },
  { slug: "cameras", title: "Камер", text: "Халаасны гимбал, экшн, 360° камерууд" },
  { slug: "handheld", title: "Гар төхөөрөмж", text: "Тогтворжуулагч, утасгүй микрофон" },
  { slug: "power", title: "Power", text: "Зөөврийн цахилгаан станц, цэнэглэгч" },
  { slug: "accessories", title: "Дагалдах хэрэгсэл", text: "Батерей, сэнс, цүнх, шүүлтүүр" },
];

const STORE_MAP_URL = "https://www.google.com/maps/search/?api=1&query=Ikh+Naytad+Plaza+Ulaanbaatar";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const series = resolveSeries(products);
  const heroSlides = series.slice(0, HERO_SLIDE_COUNT);
  const gridSeries = series.slice(HERO_SLIDE_COUNT);

  // Prefer a stocked product's photo so categories without a showcase series still get a real image.
  const productImage = (slug: string) => {
    const inCategory = products.filter((p) => p.categorySlug === slug && p.images?.length > 0);
    const pick = inCategory.find((p) => p.stockQty > 0) ?? inCategory[0];
    return (pick?.images.find((img) => img.isThumbnail) ?? pick?.images[0])?.url;
  };

  const categoryImage = (slug: string) =>
    (categories as { slug: string; image_url?: string | null }[]).find((c) => c.slug === slug)?.image_url ??
    series.find((s) => s.category === slug)?.image ??
    productImage(slug) ??
    "/assets/drone-product.png";

  return (
    <div className="home-page" style={{ background: "#fff" }}>
      <HeroSection slides={heroSlides} />

      <ProductBannerGrid series={gridSeries} />

      <div className="dj-compare">
        <h3>Бүх бүтээгдэхүүн</h3>
        <p>Дрон, камер, гар төхөөрөмж болон дагалдах хэрэгслийн бүрэн жагсаалт</p>
        <Link href="/products" className="dj-btn dj-btn-primary dj-btn-lg">
          Дэлгүүр хэсэх <ChevronRight size={16} />
        </Link>
      </div>

      <ShotOnCarousel videos={SHOT_ON_VIDEOS} />

      <section className="dj-block" aria-label="Ангиллууд">
        <h2 className="dj-section-title">DJI бүтээгдэхүүнийг ангиллаар нь</h2>
        <p className="dj-section-sub">Таны хэрэгцээнд тохирох төхөөрөмжийг сонгоорой.</p>
        <div className="dj-fields">
          {FIELDS.map((field) => (
            <Link key={field.slug} href={`/products?category=${field.slug}`} className="dj-field">
              <h3>{field.title}</h3>
              <p>{field.text}</p>
              <span className="dj-link">
                Дэлгэрэнгүй <ChevronRight size={14} />
              </span>
              <div className="dj-field-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={categoryImage(field.slug)} alt="" loading="lazy" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dj-service" aria-label="Үйлчилгээ">
        <div className="dj-service-inner">
          <a href={STORE_MAP_URL} target="_blank" rel="noreferrer" className="dj-service-item">
            <MapPin size={40} strokeWidth={1.2} />
            <h4>Манай дэлгүүр</h4>
            <span>
              Их Наяд Плаза, 3 давхар <ChevronRight size={14} />
            </span>
          </a>
          <Link href="/help/delivery" className="dj-service-item">
            <Truck size={40} strokeWidth={1.2} />
            <h4>Хүргэлт</h4>
            <span>
              Хүргэлтийн нөхцөл <ChevronRight size={14} />
            </span>
          </Link>
          <a href="tel:+97688157242" className="dj-service-item">
            <Phone size={40} strokeWidth={1.2} />
            <h4>Холбоо барих</h4>
            <span>
              8815-7242 <ChevronRight size={14} />
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
