import Link from "next/link";
import { getProducts, getSiteSettings } from "../lib/supabase/queries";
import { ArrowRight, Camera, Battery, Zap, Globe } from "lucide-react";
import { ProductCarousel } from "../components/product/product-carousel";

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings()
  ]);

  const featured = products.slice(0, 6);

  // Fallback URLs (The original DJI videos)
  const fallbackVideos = {
    home_hero: "https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/WA150%20SHOT%20ON/F75_WA150__DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N.mp4",
    home_showcase_main: "https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/OW001%20shot%20on/F81_OW001_%E2%89%A410s_DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N.mp4",
    home_showcase_side: "https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/WA150%20SHOT%20ON/F75_WA150__DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N.mp4",
  };

  const carouselItems = [
    ...featured.slice(0, 2),
    ...(featured.length <= 2 ? [
      {
        id: "static-1",
        name: "DEER Air 3",
        categoryName: "Хүчирхэг хос камер",
        shortDescription: "All in One",
        slug: "",
        images: [{ url: "/assets/drone-product.png" }]
      },
      {
        id: "static-2",
        name: "DEER Mini 4 Pro",
        categoryName: "Mini to the Max",
        shortDescription: "Хөнгөн бас хүчирхэг",
        slug: "",
        images: [{ url: "/assets/drone-product.png" }]
      }
    ] : []),
    ...featured.slice(2, 6)
  ];

  return (
    <div
      className="home-page text-sans-serif"
      style={{
        backgroundColor: "#000",
        fontFamily: "var(--font-ui), sans-serif",
        letterSpacing: "normal",
      }}
    >

      {/* Hero Section 2 - Second Product */}
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
                <span
                  className="text-uppercase mb-3 fw-semibold"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.2em", opacity: 0.9 }}
                >
                  {featured[1]?.categoryName || "Creator Series"}
                </span>
                <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  {featured[1]?.name || "DEER ACTION CAM"}
                </h2>
                <p className="fs-5 mb-4" style={{ fontWeight: 300, fontSize: "clamp(1rem, 1.8vw, 1.3rem)", maxWidth: "500px", lineHeight: 1.6 }}>
                  {featured[1]?.shortDescription || "Адал явдалд бэлэн"}
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href={`/products/${featured[1]?.slug || "action-4"}`} className="dji-border-btn">
                    Дэлгэрэнгүй <ArrowRight size={16} className="ms-2 mt-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Summary Section */}
      <section className="bg-white" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="text-center mb-5 pb-5">
            <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em", color: "#111827" }}>
              Яагаад DEER Drone гэж?
            </h2>
            <p className="text-secondary mx-auto" style={{ fontSize: "1.1rem", maxWidth: "600px", fontWeight: 400, opacity: 0.7 }}>
              Бид дроны хамгийн сүүлийн үеийн технология, мэргэжлийн үйлчилгээг хослуулан хүргэж байна.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              { 
                icon: Camera, 
                title: "4K HDR Camera", 
                desc: "Мэргэжлийн түвшний гайхалтай зураг, видео бичлэг."
              },
              { 
                icon: Battery, 
                title: "46 min Flight", 
                desc: "Нэг удаагийн цэнэглэлтээр удаан нисэх боломж."
              },
              { 
                icon: Zap, 
                title: "Smart Features", 
                desc: "Саад тотгороос зайлсхийх AI мэдрэгчийн систем."
              },
              { 
                icon: Globe, 
                title: "Global Support", 
                desc: "Албан ёсны баталгаа, засвар үйлчилгээний систем."
              }
            ].map((f, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-3">
                <div 
                  className="feature-card h-100 p-4 transition-all" 
                  style={{ 
                    background: "transparent",
                    textAlign: "center"
                  }}
                >
                  <div 
                    className="mb-4 d-inline-flex align-items-center justify-content-center" 
                    style={{ 
                      width: "60px", 
                      height: "60px", 
                      color: "#111827"
                    }}
                  >
                    <f.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="fw-bold mb-2" style={{ fontSize: "1.1rem", color: "#111827" }}>
                    {f.title}
                  </h3>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.88rem", lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid - DJI Style Tiles */}
      <section className="bg-light pb-5">
        <div className="container-fluid w-100">
          <div className="text-center mb-5 pt-5">
            <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}>
              Бүтээгдэхүүн
            </h2>
          </div>

          <ProductCarousel products={carouselItems} />
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
