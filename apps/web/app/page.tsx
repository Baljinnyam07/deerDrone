import Link from "next/link";
import { getProducts, getSiteSettings } from "../lib/supabase/queries";
import { ArrowRight, Search, Users, Wrench, FileVideo } from "lucide-react";
import { ProductCarousel } from "../components/product/product-carousel";

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings()
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
      <section className="bg-white" style={{ padding: "120px 0", overflow: "hidden" }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div style={{ position: "relative" }}>
                <span className="text-primary fw-bold text-uppercase mb-3 d-block" style={{ letterSpacing: "0.1em", fontSize: "0.9rem" }}>
                  Perspective
                </span>
                <h2 className="fw-bold mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 1.1, color: "#111827" }}>
                  Яагаад дрон <br /> авах гэж ?
                </h2>
                <div style={{ width: "60px", height: "4px", backgroundColor: "var(--bs-primary)", marginBottom: "40px" }} />
                
                <p className="lead mb-4" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#111827", lineHeight: 1.5 }}>
                  Дэлхийг зүгээр нэг харахаас илүү, өөр өнцгөөс мэдрэхийг хүсдэг хүмүүст дрон хэрэгтэй.
                </p>
                
                <p className="text-secondary mb-5" style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                  Өнөөдөр дрон бол тоглоом биш. Энэ бол таны харж, мэдэрч, бүтээж чадах боломжийг шинэ түвшинд гаргах хэрэгсэл юм.
                </p>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="row g-4">
                <div className="col-12">
                  <div className="p-4 rounded-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <p className="mb-0" style={{ fontSize: "1.1rem", color: "#334155", lineHeight: 1.7 }}>
                      Та аялал, гэр бүл, найз нөхдийнхөө мөчүүдийг энгийн зураг биш, тэнгэрээс авсан чанартай бичлэг болгон үлдээж чадна. Нэг л бичлэг таны дурсамжийг илүү үнэ цэнтэй болгоно.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 h-100 rounded-4" style={{ backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE" }}>
                    <h4 className="fw-bold mb-3" style={{ fontSize: "1.1rem", color: "#1E40AF" }}>Ялгарал</h4>
                    <p className="mb-0" style={{ fontSize: "0.95rem", color: "#1E3A8A", opacity: 0.8 }}>
                      Сошиал орчинд энгийн контент биш, агаараас авсан зураг, бичлэг хүмүүсийн анхаарлыг шууд татдаг.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 h-100 rounded-4" style={{ backgroundColor: "#F0FDF4", border: "1px solid #DCFCE7" }}>
                    <h4 className="fw-bold mb-3" style={{ fontSize: "1.1rem", color: "#166534" }}>Орлого</h4>
                    <p className="mb-0" style={{ fontSize: "0.95rem", color: "#14532D", opacity: 0.8 }}>
                      Үл хөдлөх хөрөнгө, арга хэмжээ, аяллын контент зэрэг олон төрлийн ажил хийж орлого олох боломжтой.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 text-center">
            <div className="p-5 rounded-5 shadow-sm" style={{ backgroundColor: "#0F172A", color: "white" }}>
              <p className="mb-0 mx-auto" style={{ maxWidth: "800px", fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.7, opacity: 0.9 }}>
                Эцэст нь, дрон авна гэдэг төхөөрөмж авах тухай биш. Энэ бол өөр өнцгөөс харах, өөр боломж нээх, өөр түвшинд хүрэх шийдвэр юм.
              </p>
            </div>
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
