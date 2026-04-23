import Link from "next/link";
import { getProducts, getSiteSettings, getCategories } from "../lib/supabase/queries";
import { ArrowRight } from "lucide-react";
import { CategoryCircleGrid } from "../components/category/category-circle-grid";

const CLOUD_NAME = "dx3ymrxfs";

function cldVideo(publicId: string, width: number) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto,w_${width}/${publicId}.mp4`;
}

export default async function HomePage() {
  const [products, settings, categories] = await Promise.all([
    getProducts(),
    getSiteSettings(),
    getCategories(),
  ]);

  const featured = products.slice(0, 6);

  const heroProduct =
    products.find((p) => p.slug === settings.home_hero_product_slug) ||
    featured[1] ||
    featured[0];

  // Cloudinary fallback URLs
  const fallbackVideos = {
    home_hero: cldVideo(
      "F75_WA150__DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N_ulf8s0",
      1600
    ),
    home_showcase_main: cldVideo(
      "F81_OW001__E2_89_A410s_DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N_zr8flp",
      1400
    ),
    // 3 дахь side video-ны public id одоохондоо ирээгүй тул түр hero-г fallback болгож байна
    home_showcase_side: cldVideo(
      "F75_WA150__DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N_ulf8s0",
      900
    ),
  };

  const heroVideo = settings.home_hero || fallbackVideos.home_hero;
  const showcaseMainVideo =
    settings.home_showcase_main || fallbackVideos.home_showcase_main;
  const showcaseSideVideo =
    settings.home_showcase_side || fallbackVideos.home_showcase_side;

  return (
    <div
      className="home-page text-sans-serif"
      style={{
        backgroundColor: "#000",
        fontFamily: "var(--font-ui), sans-serif",
        letterSpacing: "normal",
      }}
    >
      {/* Hero Section */}
      <section
        className="position-relative w-100 overflow-hidden bg-black"
        style={{ height: "100vh" }}
      >
        <video
          className="position-absolute w-100 h-100"
          style={{ objectFit: "cover", top: 0, left: 0, zIndex: 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          key={heroVideo}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div
          className="position-absolute w-100 h-100"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
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
                <h2
                  className="fw-bold mb-3"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                  }}
                >
                  {heroProduct?.name || "DEER ACTION CAM"}
                </h2>

                <p
                  className="fs-5 mb-4"
                  style={{
                    fontWeight: 300,
                    fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                    maxWidth: "500px",
                    lineHeight: 1.6,
                  }}
                >
                  {heroProduct?.shortDescription || "Адал явдалд бэлэн"}
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <Link
                    href={`/products/${heroProduct?.slug || "action-4"}`}
                    className="dji-border-btn"
                  >
                    Дэлгэрэнгүй <ArrowRight size={16} className="ms-2 mt-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section
        style={{
          backgroundColor: "#fff",
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <div className="container-fluid w-100">
          <div className="text-center mb-4">
            <h2
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#111827",
                margin: 0,
                fontFamily:
                  "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', sans-serif",
              }}
            >
              Бүтээгдэхүүн
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
              <div
                className="position-relative rounded overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <video
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  key={showcaseMainVideo}
                >
                  <source src={showcaseMainVideo} type="video/mp4" />
                </video>
              </div>

              <div className="text-center mt-5">
                <span
                  className="text-uppercase fw-semibold mb-3 d-block"
                  style={{
                    fontSize: "0.85rem",
                    letterSpacing: "0.2em",
                    color: "#666",
                  }}
                >
                  Shot on DEER
                </span>
                <h2
                  className="fw-bold text-white mb-3"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Standing at the Forefront of Innovation
                </h2>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div
                className="position-relative rounded overflow-hidden h-100"
                style={{ aspectRatio: "9/16" }}
              >
                <video
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  key={showcaseSideVideo}
                >
                  <source src={showcaseSideVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}