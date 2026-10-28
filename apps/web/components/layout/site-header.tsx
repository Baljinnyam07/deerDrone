"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, User, X, LogOut, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useStore } from "../../store/useStore";
import { SearchOverlay } from "./search-overlay";
import type { Series } from "../../lib/showcase";

type MenuChild = {
  href: string;
  label: string;
};

type MenuItem = {
  children: MenuChild[];
  href: string;
  id: string;
  label: string;
};

const menuItems: MenuItem[] = [
  {
    id: "products",
    label: "Бүтээгдэхүүн",
    href: "/products?category=drones",
    children: [
      { label: "Дрон", href: "/products?category=drones" },
      { label: "Камер", href: "/products?category=cameras" },
      { label: "Гар төхөөрөмж", href: "/products?category=handheld" },
      { label: "Дагалдах хэрэгсэл", href: "/products?category=accessories" },
      { label: "Power", href: "/products?category=power" },
      { label: "Лизинг", href: "/leasing" },
    ],
  },
  {
    id: "about",
    label: "Танилцуулга",
    href: "/about",
    children: [
      { label: "Бидний тухай", href: "/about" },
      { label: "Холбоо барих", href: "#" },
    ],
  },
  {
    id: "help",
    label: "Тусламж",
    href: "/help/terms",
    children: [
      { label: "Үйлчилгээний нөхцөл", href: "/help/terms" },
      { label: "Нууцлалын бодлого", href: "/help/privacy" },
      { label: "Хамтран ажиллах", href: "/help/cooperate" },
      { label: "Хүргэлтийн нөхцөл", href: "/help/delivery" },
    ],
  },
];

type NavItem = {
  id: string;
  label: string;
  href: string;
  /** Category slug: hovering shows that category's series in the mega menu. */
  category?: string;
  /** Plain text links shown in the mega menu instead of series. */
  links?: MenuChild[];
};

const navItems: NavItem[] = [
  { id: "drones", label: "Дрон", href: "/products?category=drones", category: "drones" },
  { id: "cameras", label: "Камер", href: "/products?category=cameras", category: "cameras" },
  { id: "handheld", label: "Гар төхөөрөмж", href: "/products?category=handheld", category: "handheld" },
  { id: "power", label: "Power", href: "/products?category=power", category: "power" },
  { id: "accessories", label: "Дагалдах хэрэгсэл", href: "/products?category=accessories" },
  { id: "help", label: "Тусламж", href: "/help/terms", links: menuItems[2].children },
  { id: "about", label: "Бидний тухай", href: "/about", links: menuItems[1].children },
];

const ANNOUNCE_KEY = "dj-announce-dismissed";

// Detect Facebook, Instagram, Twitter, Line and other in-app browsers
// that block Google OAuth (Error 403: disallowed_useragent)
function isInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FB_IAB|FBAN|FBAV|Instagram|Twitter|Line\/|MicroMessenger|LinkedInApp|GSA\/|KAKAOTALK/i.test(ua);
}

export function SiteHeader({ navSeries = [] }: { navSeries?: Series[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get("category") ?? null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<"user" | "cart" | null>(null);
  const [email, setEmail] = useState("");
  const [magicLinkStatus, setMagicLinkStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const cartItems = useStore((state) => state.cartItems);

  // Global event listener for login popup
  useEffect(() => {
    const handleOpenLogin = () => setIsLoginPopupOpen(true);
    window.addEventListener('open-login-modal', handleOpenLogin);
    return () => window.removeEventListener('open-login-modal', handleOpenLogin);
  }, []);

  const megaContent = (item: NavItem) => {
    const series = item.category ? navSeries.filter((s) => s.category === item.category) : [];
    const links = item.links ?? [];
    return series.length > 0 || links.length > 0 ? { series, links } : null;
  };

  useEffect(() => {
    try {
      setShowAnnounce(window.localStorage.getItem(ANNOUNCE_KEY) !== "1");
    } catch {
      setShowAnnounce(true);
    }
  }, []);

  const dismissAnnounce = () => {
    setShowAnnounce(false);
    try {
      window.localStorage.setItem(ANNOUNCE_KEY, "1");
    } catch {
      /* storage unavailable: hide for this visit only */
    }
  };

  useEffect(() => {
    setMounted(true);
    setInAppBrowser(isInAppBrowser());
    let isActive = true;
    let unsubscribe: (() => void) | undefined;
    async function syncAuth() {
      try {
        const { createClient } = await import("../../lib/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (isActive) setUser(session?.user ?? null);
        const { data } = supabase.auth.onAuthStateChange((_, nextSession) => {
          if (isActive) setUser(nextSession?.user ?? null);
        });
        unsubscribe = () => data.subscription.unsubscribe();
      } catch { if (isActive) setUser(null); }
    }
    void syncAuth();
    return () => { isActive = false; unsubscribe?.(); };
  }, []);

  useEffect(() => {
    setHoveredItem(null);
  }, [pathname, activeCategory]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleMagicLink = async () => {
    if (!email || !email.includes("@")) return;
    setMagicLinkStatus("loading");
    try {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();
      // emailRedirectTo: simple URL without extra query params to avoid PKCE issues
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          shouldCreateUser: true,
        },
      });
      setMagicLinkStatus(error ? "error" : "success");
    } catch {
      setMagicLinkStatus("error");
    }
  };

  const handleGoogleLogin = () => {
    const url = `/api/auth/google?redirect=${encodeURIComponent("/auth/success")}`;

    // In-app browsers (Facebook, Instagram, etc.) block Google OAuth popups.
    // Force navigation to the real browser via window.location.href instead.
    if (isInAppBrowser()) {
      window.location.href = url;
      return;
    }

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      url,
      "google-login",
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    );
    
    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          window.location.reload();
        }
      }, 500);
    }
  };

  return (
    <>
      <header
        className={`dj-header${isScrolled ? " is-scrolled" : ""}${pathname === "/" ? " is-home" : ""}${pathname === "/" && !isScrolled && !hoveredItem ? " is-overlay" : ""}`}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div className="dj-header-inner">
          <Link href="/" className="dj-logo" aria-label="DEER Drone">
            <Image alt="DEER" src="/assets/brand/deer-logo.svg" width={110} height={32} priority />
          </Link>

          <nav className="dj-nav" aria-label="Үндсэн цэс">
            {navItems.map((item) => {
              const isActive = item.category
                ? pathname.startsWith("/products") && activeCategory === item.category
                : pathname === item.href;
              return (
                <div
                  key={item.id}
                  className={`dj-nav-item${hoveredItem === item.id ? " is-open" : ""}`}
                  onMouseEnter={() => setHoveredItem(megaContent(item) ? item.id : null)}
                >
                  <Link href={item.href} className={`dj-nav-link${isActive ? " is-active" : ""}`}>
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="dj-actions">
            <button className="dj-icon-btn" aria-label="Хайх" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} strokeWidth={1.6} />
            </button>

            {/* Cart Icon & Dropdown - Desktop Only */}
            {isDesktop && mounted && (
              <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                <button
                  className="dj-icon-btn"
                  aria-label="Сагс"
                  onClick={() => setActiveDropdown(activeDropdown === "cart" ? null : "cart")}
                >
                  <ShoppingCart size={20} strokeWidth={1.6} />
                  {cartItemCount > 0 && <span className="dj-badge">{cartItemCount}</span>}
                </button>
                <AnimatePresence>
                  {activeDropdown === "cart" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: "12px",
                        width: "380px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        borderRadius: "28px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
                        padding: "24px",
                        zIndex: 1100
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <ShoppingBag size={20} strokeWidth={2.5} color="#0F172A" />
                          <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em", fontFamily: "var(--font-display)" }}>Миний сагс</h4>
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "#F1F5F9", color: "#64748B", padding: "4px 10px", borderRadius: "10px", fontFamily: "var(--font-body)" }}>{cartItemCount} бараа</span>
                      </div>
                      
                      {cartItems.length > 0 ? (
                        <>
                          <div style={{ maxHeight: "320px", overflowY: "auto", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "16px", paddingRight: "4px" }} className="custom-scrollbar">
                            {cartItems.map((item) => (
                              <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "center", position: "relative" }}>
                                <div style={{ width: "64px", height: "64px", borderRadius: "14px", backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                                  <Image src={(item.image || "/assets/placeholder.png").replace(/ik\.imagekit\.io(.*)\.png$/, "ik.imagekit.io$1")} alt={item.name} fill style={{ objectFit: "cover" }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ margin: "0 0 4px", fontSize: "0.9rem", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>{item.name}</p>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "#64748B", backgroundColor: "#F1F5F9", padding: "2px 6px", borderRadius: "6px", fontWeight: 600, fontFamily: "var(--font-body)" }}>{item.quantity}ш</span>
                                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2563EB", fontFamily: "var(--font-body)" }}>{item.price.toLocaleString()}₮</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div style={{ backgroundColor: "#F8FAFC", borderRadius: "20px", padding: "16px", marginBottom: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748B", fontFamily: "var(--font-body)" }}>Нийт дүн:</span>
                              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", fontFamily: "var(--font-display)" }}>{cartTotal.toLocaleString()}₮</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "12px" }}>
                            <Link 
                              href="/cart" 
                              onClick={() => setActiveDropdown(null)}
                              style={{ 
                                flex: 1, 
                                textAlign: "center", 
                                padding: "14px", 
                                backgroundColor: "#FFFFFF", 
                                color: "#0F172A", 
                                border: "1.5px solid #E2E8F0",
                                textDecoration: "none", 
                                fontSize: "0.9rem", 
                                fontWeight: 700, 
                                borderRadius: "14px",
                                transition: "all 200ms",
                                fontFamily: "var(--font-body)"
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F8FAFC"}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFFFFF"}
                            >
                              Сагс харах
                            </Link>
                            <Link 
                              href="/checkout" 
                              onClick={() => setActiveDropdown(null)}
                              style={{ 
                                flex: 1, 
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                padding: "14px", 
                                backgroundColor: "#0F172A", 
                                color: "#FFFFFF", 
                                textDecoration: "none", 
                                fontSize: "0.9rem", 
                                fontWeight: 700, 
                                borderRadius: "14px",
                                transition: "all 200ms",
                                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
                                fontFamily: "var(--font-body)"
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                            >
                              Төлөх <ArrowRight size={16} />
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div style={{ padding: "40px 0", textAlign: "center" }}>
                          <div style={{ width: "64px", height: "64px", backgroundColor: "#F8FAFC", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <ShoppingBag size={32} color="#CBD5E1" strokeWidth={1.5} />
                          </div>
                          <p style={{ margin: "0 0 8px", color: "#0F172A", fontWeight: 700 }}>Сагс хоосон байна</p>
                          <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.85rem" }}>Таалагдсан бараагаа сагсандаа нэмээрэй</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cart Icon - Mobile Only */}
            {!isDesktop && mounted && (
              <Link href="/cart" className="dj-icon-btn" aria-label="Сагс">
                <ShoppingCart size={20} strokeWidth={1.6} />
                {cartItemCount > 0 && <span className="dj-badge">{cartItemCount}</span>}
              </Link>
            )}

            <Link href="/products?category=drones" className="dj-btn dj-btn-primary dj-store-btn">
              <ShoppingBag size={14} /> Дэлгүүр
            </Link>

            {!isDesktop && (
              <button className="dj-icon-btn" aria-label="Цэс" onClick={() => setIsMenuOpen(true)}>
                <Menu size={22} />
              </button>
            )}
          </div>
        </div>

        {/* Mega menu */}
        {isDesktop && hoveredItem && (() => {
          const item = navItems.find((i) => i.id === hoveredItem);
          const content = item && megaContent(item);
          if (!item || !content) return null;
          return (
            <div className="dj-mega" onMouseEnter={() => setHoveredItem(item.id)}>
              <div className="dj-mega-inner">
                {content.series.map((s) => (
                  <Link key={s.id} href={`/products/${s.slug}`} className="dj-mega-item" onClick={() => setHoveredItem(null)}>
                    <span className="dj-mega-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt="" className="dj-cutout" loading="lazy" />
                    </span>
                    {s.shortName}
                  </Link>
                ))}
                {content.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="dj-mega-item"
                    style={{ width: "auto", padding: "8px 16px" }}
                    onClick={(e) => {
                      if (link.label === "Холбоо барих") {
                        e.preventDefault();
                        setIsContactOpen(true);
                      }
                      setHoveredItem(null);
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                {item.category && (
                  <div className="dj-mega-all">
                    <Link href={item.href} className="dj-link" style={{ fontSize: "14px" }} onClick={() => setHoveredItem(null)}>
                      Бүгдийг үзэх <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </header>

      {/* Side Contact Drawer (Exact same as Footer) */}
      <div
        onClick={() => setIsContactOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 9998,
          display: isContactOpen ? "block" : "none",
          transition: "opacity 0.3s ease",
          opacity: isContactOpen ? 1 : 0
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#FFFFFF",
          zIndex: 9999,
          visibility: isContactOpen ? "visible" : "hidden",
          transform: isContactOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), visibility 0.4s",
          boxShadow: isContactOpen ? "-15px 0 40px rgba(0,0,0,0.08)" : "none",
          display: "flex",
          flexDirection: "column",
          padding: "0"
        }}
      >
        <div style={{ padding: "24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h5 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#1d1d1f" }}>Холбоо барих</h5>
          <button onClick={() => setIsContactOpen(false)} style={{ background: "none", border: "none", padding: "8px", cursor: "pointer", color: "#64748B" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          <div style={{ marginBottom: "32px" }}>
            <h6 style={{ fontWeight: 700, marginBottom: "8px", color: "#1d1d1f", fontSize: "1.05rem" }}>Хаяг:</h6>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
              Улаанбаатар хот, Хан-Уул дүүрэг, 15-р хороо<br />
              Их наяд Плаза, Зүүн өндөр, 3-р давхар, 305 тоот
            </p>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h6 style={{ fontWeight: 700, marginBottom: "12px", color: "#1d1d1f", fontSize: "1.05rem" }}>Утас:</h6>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "0.95rem" }}>
              <span style={{ fontSize: "1.2rem" }}>📞</span>
              <a href="tel:88157242" style={{ textDecoration: "none", color: "#64748B" }}>8815-7242</a>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, fontSize: "0.95rem" }}>
              <span style={{ fontSize: "1.2rem" }}>📞</span>
              <a href="tel:99977242" style={{ textDecoration: "none", color: "#64748B" }}>9997-7242</a>
            </p>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h6 style={{ fontWeight: 700, marginBottom: "8px", color: "#1d1d1f", fontSize: "1.05rem" }}>Имэйл:</h6>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, fontSize: "0.95rem" }}>
              <span style={{ fontSize: "1.2rem" }}>📧</span>
              <a href="mailto:deer.drone.shop@gmail.com" style={{ textDecoration: "none", color: "#64748B" }}>Deer.Drone.Shop@gmail.com</a>
            </p>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h6 style={{ fontWeight: 700, marginBottom: "8px", color: "#1d1d1f", fontSize: "1.05rem" }}>Ажлын цаг:</h6>
            <p style={{ color: "#64748B", fontSize: "0.95rem" }}>Даваа – Ням: 11:00 – 19:00</p>
          </div>

          <div style={{ borderRadius: "12px", overflow: "hidden", width: "100%", marginTop: "40px", height: "220px", border: "1px solid #f0f0f0" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2675.297745778844!2d106.91572977636655!3d47.89196396843467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9693abebca4e81%3A0xe5aebd5fbc7cd10f!2sIkh%20Naytad%20Plaza!5e0!3m2!1smn!2smn!4v1699999999999!5m2!1smn!2smn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* Login Popup Window */}
      <AnimatePresence>
        {isLoginPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => e.target === e.currentTarget && setIsLoginPopupOpen(false)}
          >
            <div
              onClick={() => setIsLoginPopupOpen(false)}
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              style={{ position: "relative", width: "100%", maxWidth: "400px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
            >
              {/* Header gradient band */}
              <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)", padding: "32px 24px 28px", textAlign: "center", position: "relative" }}>
                <button
                  onClick={() => setIsLoginPopupOpen(false)}
                  style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                >
                  <X size={16} />
                </button>
                <div style={{ margin: "0 auto 14px", width: "56px", height: "56px", background: "rgba(255,255,255,0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image alt="DEER" src="/assets/brand/deer-logo.svg" width={34} height={34} style={{ filter: "invert(1)", width: "auto", height: "28px" }} />
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
                  DEER Drone-д тавтай морил
                </h3>
              </div>

              {/* Benefits */}
              {/* <div style={{ padding: "20px 24px 0" }}>
                {[
                  { icon: "🛒", title: "Сагслах", desc: "Сонгосон бараагаа сагсалж хадгална" },
                  { icon: "⚡", title: "Хурдан худалдан авалт", desc: "Мэдээлэл дахин оруулахгүй шууд захиалах" },
                ].map((b) => (
                  <div key={b.title} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "20px", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>{b.icon}</span>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: "0.88rem", fontWeight: 650, color: "#0F172A" }}>{b.title}</p>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.4 }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div> */}

              {/* Action area */}
              <div style={{ padding: "0 24px 24px", backgroundColor: "#F1F5F9", display: "flex", flexDirection: "column", gap: "10px" }}>

                {/* In-App Browser Warning (Facebook/Instagram Messenger WebView) */}
                {inAppBrowser ? (
                  <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>

                    {/* Magic Link — Email OTP */}
                    {magicLinkStatus === "success" ? (
                      <div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: "14px", padding: "18px 16px", textAlign: "center" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "1.1rem" }}>📬</p>
                        <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#166534", fontSize: "0.92rem" }}>Имэйл илгээгдлээ!</p>
                        <p style={{ margin: 0, fontSize: "0.80rem", color: "#15803D", lineHeight: 1.5 }}>
                          <strong>{email}</strong> хаяг руу нэвтрэх линк илгээлээ. Имэйлдээ орж линкийг дарна уу.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p style={{ margin: "0 0 2px", fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>✉️ Имэйлээр нэвтрэх</p>
                        <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                          Имэйл хаягаа оруулахад нэвтрэх линк илгээнэ.
                        </p>
                        <input
                          type="email"
                          placeholder="Таны имэйл хаяг"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleMagicLink()}
                          style={{
                            width: "100%", padding: "12px 14px",
                            border: "1.5px solid #CBD5E1", borderRadius: "10px",
                            fontSize: "0.92rem", color: "#0F172A",
                            backgroundColor: "#ffffff", outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                        <button
                          onClick={handleMagicLink}
                          disabled={magicLinkStatus === "loading"}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            width: "100%", padding: "13px",
                            backgroundColor: magicLinkStatus === "loading" ? "#94A3B8" : "#0F172A",
                            color: "#FFFFFF", border: "none",
                            borderRadius: "12px", fontSize: "0.95rem", fontWeight: 600,
                            cursor: magicLinkStatus === "loading" ? "not-allowed" : "pointer",
                            boxShadow: "0 4px 12px rgba(15,23,42,0.2)",
                          }}
                        >
                          {magicLinkStatus === "loading" ? "Илгээж байна..." : "✉️ Нэвтрэх линк авах"}
                        </button>
                        {magicLinkStatus === "error" && (
                          <p style={{ margin: "0", textAlign: "center", fontSize: "0.78rem", color: "#DC2626" }}>Алдаа гарлаа. Имэйл хаягаа шалгаад дахин оролдоно уу.</p>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  /* Normal Google Login */
                  <button
                    onClick={handleGoogleLogin}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                      width: "100%", padding: "13px",
                      marginTop: "24px",
                      backgroundColor: "#ffffff", color: "#0F172A",
                      border: "1.5px solid #E2E8F0",
                      borderRadius: "12px", fontSize: "0.95rem", fontWeight: 600,
                      cursor: "pointer", transition: "border-color 150ms, box-shadow 150ms, transform 120ms",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#94A3B8"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google-ээр нэвтрэх
                  </button>
                )}

                {/* Facebook Login — идэвхгүй (тохиргоо дуусаагүй)
                <Link
                  href={`/api/auth/facebook?redirect=${encodeURIComponent(pathname === "/login" ? "/account" : pathname)}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    width: "100%", padding: "13px",
                    backgroundColor: "#1877F2", color: "#FFFFFF",
                    borderRadius: "12px", fontSize: "0.95rem", fontWeight: 600,
                    textDecoration: "none", transition: "background 150ms, transform 120ms",
                    boxShadow: "0 4px 14px rgba(24,119,242,0.3)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1464CC"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#1877F2"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook-ээр нэвтрэх
                </Link>
                */}

                <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: "0.75rem", color: "#CBD5E1", lineHeight: 1.5 }}>
                  Нэвтэрснээр{" "}
                  <Link href="/help/terms" onClick={() => setIsLoginPopupOpen(false)} style={{ color: "#94A3B8", textDecoration: "underline" }}>
                    үйлчилгээний нөхцөл
                  </Link>
                  -ийг зөвшөөрнө.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.category-nav-link:hover) { color: #0F172A !important; }
        :global(.dropdown-item:hover) { 
          background-color: #F8FAFC !important; 
          color: #0F172A !important; 
          transform: translateX(4px);
        }
        :global(.dropdown-item-danger:hover) { 
          background-color: #FEF2F2 !important; 
          transform: translateX(4px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
      `}</style>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 2000 }}>
            <div onClick={() => setIsMenuOpen(false)} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
            <motion.div animate={{ x: 0 }} initial={{ x: "-100%" }} transition={{ type: "spring", damping: 25 }} style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "300px", backgroundColor: "#FFFFFF", padding: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                <Image alt="Logo" src="/assets/brand/deer-logo.svg" width={100} height={28} />
                <button onClick={() => setIsMenuOpen(false)} style={{ background: "none", border: "none" }}><X size={24} /></button>
              </div>
              {menuItems.map(item => (
                <div key={item.id} style={{ marginBottom: "20px" }}>
                  <div onClick={() => setOpenMobileSection(openMobileSection === item.id ? null : item.id)} style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                    {item.label} <span>{item.children.length > 0 ? "+" : ""}</span>
                  </div>
                  {openMobileSection === item.id && (
                    <div style={{ paddingLeft: "15px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {item.children.map((c, idx) => (
                        <Link
                          key={idx}
                          href={c.href}
                          onClick={(e) => {
                            if (c.label === "Холбоо барих") {
                              e.preventDefault();
                              setIsContactOpen(true);
                              setIsMenuOpen(false);
                            } else {
                              setIsMenuOpen(false);
                            }
                          }}
                          style={{ color: "#64748b", textDecoration: "none" }}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ marginTop: "40px", paddingTop: "30px", borderTop: "1px solid #F1F5F9" }}>
                {user && (
                  <Link
                    href="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#0F172A", marginBottom: "24px" }}
                  >
                    <div style={{ position: "relative" }}>
                      <ShoppingCart size={22} strokeWidth={1.5} />
                      {mounted && cartItemCount > 0 && (
                        <span style={{ position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#2563EB", color: "#FFFFFF", borderRadius: "10px", padding: "2px 6px", fontSize: "0.65rem", fontWeight: 700 }}>
                          {cartItemCount}
                        </span>
                      )}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Миний сагс</span>
                  </Link>
                )}

                {user ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#0F172A" }}>
                      <User size={22} strokeWidth={1.5} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "var(--font-display)" }}>Миний бүртгэл</span>
                        <span style={{ fontSize: "0.8rem", color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px", fontFamily: "var(--font-body)" }}>{user.email}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={async () => {
                        const { createClient } = await import("../../lib/supabase/client");
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        setIsMenuOpen(false);
                        window.location.reload();
                      }}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "12px", 
                        background: "#FEF2F2", 
                        border: "none", 
                        padding: "12px 16px", 
                        borderRadius: "12px",
                        cursor: "pointer", 
                        color: "#EF4444", 
                        fontWeight: 700, 
                        fontSize: "1rem",
                        fontFamily: "var(--font-body)"
                      }}
                    >
                      <LogOut size={20} strokeWidth={2} />
                      Гарах
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsLoginPopupOpen(true);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", padding: 0, cursor: "pointer", color: "#0F172A", textAlign: "left", fontFamily: "var(--font-display)" }}
                  >
                    <User size={22} strokeWidth={1.5} />
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Нэвтрэх / Бүртгүүлэх</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
