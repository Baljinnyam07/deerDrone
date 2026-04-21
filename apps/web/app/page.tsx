import Link from "next/link";
import { getProducts, getSiteSettings, getCategories } from "../lib/supabase/queries";
import { ArrowRight, Search, Users, Wrench, FileVideo } from "lucide-react";
import { CategoryCircleGrid } from "../components/category/category-circle-grid";

export default async function HomePage() {
  const [products, settings, categories] = await Promise.all([
    getProducts(),
    getSiteSettings(),
    getCategories(),
  ]);

  const featured = products.slice(0, 6);

  // Find the selected hero product from settings, or fallback to index 1 (or 0)
  const heroProduct = products.find(p => p.slug === settings.home_hero_product_slug) || featured[1] || featured[0];

  // Fallback URLs (The original DJI videos)
  const fallbackVideos = {
    home_hero: "https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/WA150%20SHOT%20ON/F75_WA150__DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N.mp4",
    home_showcase_main: "https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/OW001%20shot%20on/F81_OW001_%E2%89%A410s_DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N.mp4",
    home_showcase_side: "https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/WA150%20SHOT%20ON/F75_WA150__DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N.mp4",
  };

  return (
    <div
      className="home-page text-sans-serif"
      style={{
        backgroundColor: "#000",
        fontFamily: "var(--font-ui), sans-serif",
        letterSpacing: "normal",
      }}
    >

      {/* Hero Section 2 - Main Hero Product */}
      <section className="position-relative w-100 overflow-hidden bg-black" style={{ height: "100vh" }}>
        <video
          className="position-absolute w-100 h-100"
          style={{ objectFit: "cover", top: 0, left: 0, zIndex: 0 }}
          autoPlay
          muted
          loop
          playsInline
          key={settings.home_hero || fallbackVideos.home_hero}
        >
          <source
            src={settings.home_hero || fallbackVideos.home_hero}
            type="video/mp4"
          />
        </video>

        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
            zIndex: 1,
            top: 0,
            left: 0,
          }}
        />

        <div
          className="position-absolute w-100 h-100 d-flex align-items-center text-white px-4 px-md-5"
          style={{ zIndex: 2, left: 0 }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6">
                <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  {heroProduct?.name || "DEER ACTION CAM"}
                </h2>
                <p className="fs-5 mb-4" style={{ fontWeight: 300, fontSize: "clamp(1rem, 1.8vw, 1.3rem)", maxWidth: "500px", lineHeight: 1.6 }}>
                  {heroProduct?.shortDescription || "Адал явдалд бэлэн"}
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href={`/products/${heroProduct?.slug || "action-4"}`} className="dji-border-btn">
                    Дэлгэрэнгүй <ArrowRight size={16} className="ms-2 mt-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Drones Section */}
      <section style={{ overflow: "hidden", backgroundColor: "#fff", padding: "16px 16px" }}>
        <div className="why-drones-row">
          {/* Left - Content */}
          <div
            className="why-drones-content"
            style={{ backgroundImage: "url('/assets/image.png')" }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 100%)" }} />
            <div className="why-drones-content-inner">
              <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.72rem", display: "block", marginBottom: "20px" }}>
                Яагаад дрон авах гэж?
              </span>
              <h2 style={{ fontSize: "clamp(1.6rem, 5vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#FFFFFF", fontWeight: 700, marginBottom: "36px", fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif" }}>
                Дэлхийг өөр <br />өнцгөөс хар
              </h2>
              {[
                { title: "Дурсамж", desc: "Та аялал, гэр бүл, найз нөхдийнхөө мөчүүдийг тэнгэрээс авсан чанартай бичлэг болгон үлдээж чадна." },
                { title: "Ялгарал", desc: "Сошиал орчинд энгийн контент биш, агаараас авсан зураг, бичлэг хүмүүсийн анхаарлыг шууд татдаг." },
                { title: "Орлого", desc: "Үл хөдлөх хөрөнгө, арга хэмжээ, аяллын контент зэрэг олон төрлийн ажил хийж орлого олох боломжтой." },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", gap: "20px", marginBottom: "28px" }}>
                  <div style={{ width: "3px", borderRadius: "2px", backgroundColor: "#60A5FA", flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>{item.title}</h4>
                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Video */}
          <div className="why-drones-video">
            <video
              autoPlay muted loop playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src={settings.home_showcase_main || fallbackVideos.home_showcase_main} type="video/mp4" />
            </video>
            <div style={{ position: "absolute", bottom: "32px", left: "32px", zIndex: 1 }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Shot on DEER
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid - DJI Style Tiles */}
      <section style={{ backgroundColor: "#fff", paddingTop: "40px", paddingBottom: "40px" }}>
        <div className="container-fluid w-100">
          <div className="text-center mb-4">
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9ca3af", display: "block", marginBottom: "10px" }}>
              Ангилал
            </span>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#111827", margin: 0, fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif" }}>
              Онцлох ангилал
            </h2>
          </div>

          <CategoryCircleGrid categories={categories} />
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="bg-black py-5">
        <div className="container py-5">

          <div className="row g-3">
            <div className="col-12 col-md-8">
              <div className="position-relative rounded overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <video
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  key={settings.home_showcase_main || fallbackVideos.home_showcase_main}
                >
                  <source
                    src={settings.home_showcase_main || fallbackVideos.home_showcase_main}
                    type="video/mp4"
                  />
                </video>
              </div>

              <div className="text-center mt-5">
                <span className="text-uppercase fw-semibold mb-3 d-block" style={{ fontSize: "0.85rem", letterSpacing: "0.2em", color: "#666" }}>
                  Shot on DEER
                </span>
                <h2 className="fw-bold text-white mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>
                  Standing at the Forefront of Innovation
                </h2>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="position-relative rounded overflow-hidden h-100" style={{ aspectRatio: "9/16" }}>
                <video
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  key={settings.home_showcase_side || fallbackVideos.home_showcase_side}
                >
                  <source
                    src={settings.home_showcase_side || fallbackVideos.home_showcase_side}
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
