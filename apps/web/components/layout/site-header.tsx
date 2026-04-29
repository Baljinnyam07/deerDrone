"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import { useStore } from "../../store/useStore";
import { SearchOverlay } from "./search-overlay";

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

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const cartItems = useStore((state) => state.cartItems);

  const isHomePage = pathname === "/";
  const shouldShowDarkHeader = isScrolled || !isHomePage || isHeaderHovered || !!hoveredItem;

  useEffect(() => {
    setMounted(true);
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => {
          setIsHeaderHovered(false);
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: shouldShowDarkHeader ? "rgba(255, 255, 255, 0.5)" : "transparent",
          backdropFilter: shouldShowDarkHeader ? "blur(30px)" : "none",
          // borderBottom: shouldShowDarkHeader ? "1px solid #E2E8F0" : "none",
          zIndex: 1050,
          transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          paddingTop: isScrolled ? "8px" : "16px",
          paddingBottom: isScrolled ? "8px" : "16px",
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", height: "48px" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <Image alt="DEER" src="/assets/brand/deer-logo.svg" width={110} height={32} style={{ filter: !shouldShowDarkHeader ? "invert(1)" : "none", width: "auto", height: "32px", transition: "filter 300ms" }} priority />
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: isDesktop ? "flex" : "none", alignItems: "center", gap: "40px", position: "absolute", left: "50%", transform: "translateX(-50%)", height: "100%" }}>
            {menuItems.map((item) => (
              <div 
                key={item.id} 
                onMouseEnter={() => setHoveredItem(item.id)}
                style={{ height: "100%", display: "flex", alignItems: "center" }}
              >
                <Link 
                  href={item.href} 
                  style={{ 
                    textDecoration: "none", 
                    fontWeight: 700, 
                    fontSize: "0.95rem", 
                    color: !shouldShowDarkHeader ? "#FFFFFF" : "#0F172A",
                    transition: "all 200ms",
                    opacity: hoveredItem === item.id ? 0.6 : 1
                  }}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Icons & Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button onClick={() => setIsSearchOpen(true)} style={{ background: "none", border: "none", padding: "8px", cursor: "pointer", color: !shouldShowDarkHeader ? "#FFFFFF" : "#0F172A" }}><Search size={22} strokeWidth={1.5} /></button>
            {/* {user ? (
              <Link href="/account" style={{ padding: "8px", color: !shouldShowDarkHeader ? "#FFFFFF" : "#0F172A" }}>
                <User size={22} strokeWidth={1.5} />
              </Link>
            ) : (
              <button 
                onClick={() => setIsLoginPopupOpen(true)} 
                style={{ background: "none", border: "none", padding: "8px", cursor: "pointer", color: !shouldShowDarkHeader ? "#FFFFFF" : "#0F172A" }}
              >
                <User size={22} strokeWidth={1.5} />
              </button>
            )} */}
            {/* {user && ( */}
              <Link href="/cart" style={{ position: "relative", padding: "8px", color: !shouldShowDarkHeader ? "#FFFFFF" : "#0F172A" }}>
                <ShoppingCart size={22} strokeWidth={1.5} />
                {mounted && cartItemCount > 0 && <span style={{ position: "absolute", top: "0", right: "0", backgroundColor: "#2563EB", color: "#FFFFFF", borderRadius: "10px", padding: "2px 6px", fontSize: "0.65rem", fontWeight: 700 }}>{cartItemCount}</span>}
              </Link>
            {/* )} */}
            <button onClick={() => setIsMenuOpen(true)} style={{ display: isDesktop ? "none" : "flex", background: "none", border: "none", padding: "8px", color: !shouldShowDarkHeader ? "#FFFFFF" : "#0F172A" }}><Menu size={24} /></button>
          </div>
        </div>

      </header>

      {/* Hover Category Bar */}
      <AnimatePresence>
          {hoveredItem && isDesktop && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "46px", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: "fixed",
                top: isScrolled ? "64px" : "80px",
                left: 0,
                right: 0,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                zIndex: 1049,
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
              }}
              onMouseEnter={() => setHoveredItem(hoveredItem)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "32px", height: "100%" }}>
                {menuItems.find(i => i.id === hoveredItem)?.children.map((link, idx) => (
                  <Link 
                    key={idx} 
                    href={link.href} 
                    onClick={(e) => {
                      if (link.label === "Холбоо барих") {
                        e.preventDefault();
                        setIsContactOpen(true);
                        setHoveredItem(null);
                      }
                    }}
                    style={{ 
                      textDecoration: "none", 
                      fontSize: "0.85rem", 
                      fontWeight: 650, 
                      color: "#475569",
                      padding: "0 4px",
                      transition: "color 200ms"
                    }}
                    className="category-nav-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              Улаанбаатар хот, Хан-Уул дүүрэг, 15-р хороо<br/>
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
      {!isHomePage && <div style={{ height: "65px" }} />}

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
              style={{ position: "relative", width: "100%", maxWidth: "400px", backgroundColor: "#FFFFFF", borderRadius: "24px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
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
                <p style={{ margin: 0, fontSize: "0.88rem", color: "rgba(255,255,255,0.65)" }}>
                  Нэвтэрч бүх үйлчилгээг ашиглаарай
                </p>
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

              {/* Divider */}
              <div style={{ margin: "16px 24px", height: "1px", backgroundColor: "#F1F5F9" }} />

              {/* Action area */}
              <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Google */}
                <Link
                  href={`/api/auth/google?redirect=${encodeURIComponent(pathname === "/login" ? "/account" : pathname)}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    width: "100%", padding: "13px",
                    backgroundColor: "#ffffff", color: "#0F172A",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: "12px", fontSize: "0.95rem", fontWeight: 600,
                    textDecoration: "none", transition: "border-color 150ms, box-shadow 150ms, transform 120ms",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#94A3B8"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google-ээр нэвтрэх
                </Link>

                {/* Facebook */}
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
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
