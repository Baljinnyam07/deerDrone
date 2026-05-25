import { getProducts, getSiteSettings, getCategories } from "../lib/supabase/queries";
import { CategoryCircleGrid } from "../components/category/category-circle-grid";
import { HeroSection } from "../components/home/hero-section";


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

  // Static video URLs
  const heroVideo = "https://pub-d35869f82a8446f7ae9101d79069e8b1.r2.dev/M77_WA150_30s_EN_1920x1080.mp4";
  const showcaseMainVideo = "https://res.cloudinary.com/dx3ymrxfs/video/upload/f_auto,q_auto,w_1400/F81_OW001__E2_89_A410s_DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N_zr8flp.mp4";
  const showcaseSideVideo = "https://pub-d35869f82a8446f7ae9101d79069e8b1.r2.dev/M17_WA020_30s_EN_1080x1920.mp4";

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
      <HeroSection heroVideo={heroVideo} heroProduct={heroProduct} />

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