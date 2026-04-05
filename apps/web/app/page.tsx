import Link from "next/link";
import { formatMoney } from "@deer-drone/utils";
import { getProducts } from "../lib/supabase/queries";

export default async function HomePage() {
  const products = await getProducts();
  
  // Custom section for first two featured products
  const featured = products.slice(0, 4);

  return (
    <div className="home-page text-sans-serif" style={{ backgroundColor: "#000", fontFamily: "var(--font-ui), sans-serif", letterSpacing: "normal" }}>
      
      {/* 1. Hero Edge-to-Edge 100vh Video Section */}
      <section className="position-relative w-100 overflow-hidden bg-black" style={{ height: "100vh" }}>
        <video 
          className="position-absolute w-100 h-100" 
          style={{ objectFit: "cover", top: 0, left: 0, zIndex: 0 }}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
        >
          {/* Extremely stable Drone video from Coverr */}
          <source src="https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/OW001%20shot%20on/F81_OW001_%E2%89%A410s_DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N.mp4" type="video/mp4" />
        </video>
        
        {/* Subtle gradient overlay to darken the bottom slightly for text */}
        <div className="position-absolute w-100 h-100" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 40%)", zIndex: 1, top: 0, left: 0 }}></div>
        
        {/* DJI places primary Hero text centered mostly */}
        <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white text-center px-4" style={{ zIndex: 2, top: "-5%" }}>
          <h1 className="fw-bold mb-2" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", letterSpacing: "-0.03em" }}>{featured[0]?.name || "DJI MAVIC 3 PRO"}</h1>
          <p className="fs-4 mb-4" style={{ fontWeight: 400 }}>{featured[0]?.shortDescription || "Хязгааргүй алсын хараа"}</p>
          <div className="d-flex flex-wrap justify-content-center gap-4 mt-2">
            <Link href={`/products/${featured[0]?.slug || "1"}`} className="dji-border-btn">Дэлгэрэнгүй &gt;</Link>
            <Link href={`/products/${featured[0]?.slug || "1"}`} className="dji-solid-btn">Шууд авах &gt;</Link>
          </div>
        </div>
      </section>

      {/* 2. Secondary Hero Video (Action Camera) */}
      <section className="position-relative w-100 overflow-hidden bg-black" style={{ height: "100vh" }}>
        <video 
          className="position-absolute w-100 h-100" 
          style={{ objectFit: "cover", top: 0, left: 0, zIndex: 0 }}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
        >
          {/* Extremely stable Action video from Coverr */}
          <source src="https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/WA150%20SHOT%20ON/F75_WA150__DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N.mp4" type="video/mp4" />
        </video>
        
        <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white text-center px-4" style={{ zIndex: 2, top: "-5%" }}>
          <h2 className="fw-bold mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em" }}>{featured[1]?.name || "OSMO ACTION 4"}</h2>
          <p className="fs-4 mb-4" style={{ fontWeight: 400 }}>{featured[1]?.shortDescription || "Адал явдалд бэлэн"}</p>
          <div className="d-flex flex-wrap justify-content-center gap-4 mt-2">
            <Link href={`/products/${featured[1]?.slug || "action-4"}`} className="dji-border-btn">Дэлгэрэнгүй &gt;</Link>
            <Link href={`/products/${featured[1]?.slug || "action-4"}`} className="dji-solid-btn">Шууд авах &gt;</Link>
          </div>
        </div>
      </section>

      {/* 3. Massive 50/50 Split Tiles (DJI Store signature) */}
      <section className="bg-light pb-5">
        <div className="container-fluid px-2">
          {/* Rows of split tiles based on products */}
          {featured.length > 2 ? (
            <div className="row g-2 mb-2">
              {featured.slice(2, 4).map((product, idx) => (
                <div key={product.id} className="col-12 col-md-6">
                  <div className="position-relative w-100 overflow-hidden dji-tile bg-white" style={{ borderRadius: "2px" }}>
                    <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: 1 }}>
                      <img 
                        src={product.images?.[0]?.url || "/assets/drone-product.png"} 
                        alt={product.name} 
                        className="w-100 h-100 dji-tile-img" 
                        style={{ objectFit: "cover" }} 
                      />
                    </div>
                    
                    <div className="position-relative w-100 dji-tile-content text-center pt-5 mt-4" style={{ zIndex: 2 }}>
                      <span className="d-block text-secondary mb-1" style={{ fontSize: "0.85rem", letterSpacing: "0.02em" }}>{product.categoryName}</span>
                      <h3 className="fw-bold text-dark mb-2" style={{ fontSize: "2.2rem", letterSpacing: "-0.01em" }}>{product.name}</h3>
                      <p className="text-dark mb-3" style={{ fontSize: "1rem" }}>{product.shortDescription}</p>
                      <div className="d-flex justify-content-center gap-3">
                        <Link href={`/products/${product.slug}`} className="text-dark text-decoration-none hover-opacity-75" style={{ fontSize: "0.95rem" }}>Дэлгэрэнгүй &gt;</Link>
                        <Link href={`/products/${product.slug}`} className="text-dark text-decoration-none hover-opacity-75" style={{ fontSize: "0.95rem" }}>Шууд авах &gt;</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback tiles if no products in DB */
            <div className="row g-2 mb-2">
              <div className="col-12 col-md-6">
                <div className="position-relative w-100 overflow-hidden dji-tile bg-white" style={{ borderRadius: "2px" }}>
                  <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: 1 }}>
                    <img src="/assets/drone-product.png" alt="DJI Air 3" className="w-100 h-100 dji-tile-img" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="position-relative w-100 dji-tile-content text-center pt-5 mt-4" style={{ zIndex: 2 }}>
                    <span className="d-block text-secondary mb-1" style={{ fontSize: "0.85rem", letterSpacing: "0.02em" }}>Хүчирхэг хос камер</span>
                    <h3 className="fw-bold text-dark mb-2" style={{ fontSize: "2.2rem", letterSpacing: "-0.01em" }}>DJI Air 3</h3>
                    <p className="text-dark mb-3" style={{ fontSize: "1rem" }}>All in One</p>
                    <div className="d-flex justify-content-center gap-3">
                      <Link href="/products" className="text-dark text-decoration-none hover-opacity-75" style={{ fontSize: "0.95rem" }}>Дэлгэрэнгүй &gt;</Link>
                      <Link href="/products" className="text-dark text-decoration-none hover-opacity-75" style={{ fontSize: "0.95rem" }}>Шууд авах &gt;</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="position-relative w-100 overflow-hidden dji-tile bg-white" style={{ borderRadius: "2px" }}>
                  <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: 1 }}>
                    <img src="/assets/drone-product.png" alt="DJI Mini 4 Pro" className="w-100 h-100 dji-tile-img" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="position-relative w-100 dji-tile-content text-center pt-5 mt-4" style={{ zIndex: 2 }}>
                    <span className="d-block text-secondary mb-1" style={{ fontSize: "0.85rem", letterSpacing: "0.02em" }}>Mini to the Max</span>
                    <h3 className="fw-bold text-dark mb-2" style={{ fontSize: "2.2rem", letterSpacing: "-0.01em" }}>DJI Mini 4 Pro</h3>
                    <p className="text-dark mb-3" style={{ fontSize: "1rem" }}>Хөнгөн бас хүчирхэг</p>
                    <div className="d-flex justify-content-center gap-3">
                      <Link href="/products" className="text-dark text-decoration-none hover-opacity-75" style={{ fontSize: "0.95rem" }}>Дэлгэрэнгүй &gt;</Link>
                      <Link href="/products" className="text-dark text-decoration-none hover-opacity-75" style={{ fontSize: "0.95rem" }}>Шууд авах &gt;</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional grid for more products if needed */}
          {products.length > 4 && (
            <div className="row g-2">
              {products.slice(4, 6).map((product) => (
                <div key={product.id} className="col-12 col-md-6">
                  {/* Reuse the tile pattern */}
                  <div className="position-relative w-100 overflow-hidden dji-tile bg-white" style={{ borderRadius: "2px" }}>
                    <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: 1 }}>
                      <img src={product.images?.[0]?.url || "/assets/drone-product.png"} alt={product.name} className="w-100 h-100 dji-tile-img" style={{ objectFit: "cover" }} />
                    </div>
                    <div className="position-relative w-100 dji-tile-content text-center pt-5 mt-4" style={{ zIndex: 2 }}>
                       <span className="d-block text-secondary mb-1" style={{ fontSize: "0.85rem", letterSpacing: "0.02em" }}>{product.categoryName}</span>
                       <h3 className="fw-bold text-dark mb-2" style={{ fontSize: "2.2rem", letterSpacing: "-0.01em" }}>{product.name}</h3>
                       <p className="text-dark mb-3" style={{ fontSize: "1rem" }}>{product.shortDescription}</p>
                       <div className="d-flex justify-content-center gap-3">
                          <Link href={`/products/${product.slug}`} className="text-dark text-decoration-none hover-opacity-75" style={{ fontSize: "0.95rem" }}>Дэлгэрэнгүй &gt;</Link>
                          <Link href={`/products/${product.slug}`} className="text-dark text-decoration-none hover-opacity-75" style={{ fontSize: "0.95rem" }}>Шууд авах &gt;</Link>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
