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
  children?: MenuChild[];
  featured?: boolean;
  href: string;
  id: string;
  label: string;
};

const menuItems: MenuItem[] = [
  {
    id: "products",
    label: "Products",
    href: "/products",
    children: [
      { label: "Professional Drones", href: "/products?category=professional" },
      { label: "Creator Drones", href: "/products?category=consumer" },
      { label: "Accessories", href: "/products?category=accessories" },
    ],
  },
  { id: "compare", label: "Compare", href: "/#discover" },
  { id: "stories", label: "Stories", href: "/#stories" },
  { id: "service", label: "Service", href: "/#service" },
  { id: "shop", label: "Shop", href: "/products", featured: true },
];

const navLinks = [
  { label: "Professional", href: "/products?category=professional" },
  { label: "Creator", href: "/products?category=consumer" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Compare", href: "/#discover" },
  { label: "Support", href: "/#service" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const cartItems = useStore((state) => state.cartItems);

  const isHomePage = pathname === "/";

  useEffect(() => {
    setMounted(true);

    let isActive = true;
    let unsubscribe: (() => void) | undefined;

    async function syncAuth() {
      try {
        const { createClient } = await import("../../lib/supabase/client");
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isActive) {
          setUser(session?.user ?? null);
        }

        const { data } = supabase.auth.onAuthStateChange((_, nextSession) => {
          if (isActive) {
            setUser(nextSession?.user ?? null);
          }
        });

        unsubscribe = () => data.subscription.unsubscribe();
      } catch {
        if (isActive) {
          setUser(null);
        }
      }
    }

    void syncAuth();

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor:
            isScrolled || !isHomePage ? "rgba(255, 255, 255, 0.85)" : "transparent",
          backdropFilter: isScrolled || !isHomePage ? "blur(30px)" : "none",
          borderBottom: isScrolled || !isHomePage ? "1px solid #E2E8F0" : "none",
          boxShadow: isScrolled || !isHomePage ? "0 1px 3px rgba(0, 0, 0, 0.05)" : "none",
          zIndex: 1050,
          transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          paddingTop: isScrolled || !isHomePage ? "12px" : "16px",
          paddingBottom: isScrolled || !isHomePage ? "12px" : "16px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            paddingLeft: "32px",
            paddingRight: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <Image
              alt="DEER"
              src="/assets/brand/deer-logo.svg"
              width={100}
              height={28}
              style={{
                filter: !isScrolled && isHomePage ? "invert(1)" : "none",
                width: "auto",
                height: "28px",
                transition: "filter 250ms",
              }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: isDesktop ? "flex" : "none",
              alignItems: "center",
              gap: "40px",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  letterSpacing: "0.5px",
                  color: !isScrolled && isHomePage ? "#FFFFFF" : "#0F172A",
                  transition: "opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginLeft: "auto",
            }}
          >
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{
                background: "none",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: !isScrolled && isHomePage ? "#FFFFFF" : "#0F172A",
                transition: "opacity 250ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              type="button"
              aria-label="Search"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            {/* Account Button */}
            <Link
              href={user ? "/account" : "/login"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                padding: "8px",
                color: !isScrolled && isHomePage ? "#FFFFFF" : "#0F172A",
                transition: "opacity 250ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <User size={22} strokeWidth={1.5} />
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: "8px",
                textDecoration: "none",
                color: !isScrolled && isHomePage ? "#FFFFFF" : "#0F172A",
                transition: "opacity 250ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              {mounted && cartItemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    backgroundColor: "#2563EB",
                    color: "#FFFFFF",
                    borderRadius: "12px",
                    padding: "2px 6px",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    minWidth: "18px",
                    textAlign: "center",
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              style={{
                display: isDesktop ? "none" : "flex",
                background: "none",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                color: !isScrolled && isHomePage ? "#FFFFFF" : "#0F172A",
                transition: "opacity 250ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              type="button"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {!isHomePage && <div style={{ height: "65px" }} />}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="mobile-nav-drawer"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="mobile-nav-backdrop"
              onClick={() => setIsMenuOpen(false)}
              role="presentation"
            />

            <motion.div
              animate={{ x: 0 }}
              className="mobile-nav-panel"
              exit={{ x: "-100%" }}
              initial={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
            >
              <div className="mobile-nav-top">
                <Link className="brand-lockup" href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image 
                    alt="Deer Technology" 
                    className="brand-logo" 
                    src="/assets/brand/deer-logo.svg"
                    width={120}
                    height={34}
                  />
                </Link>

                <button
                  aria-label="Close menu"
                  className="mobile-nav-close"
                  onClick={() => setIsMenuOpen(false)}
                  type="button"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mobile-nav-body">
                <div className="mobile-nav-shortcuts">
                  <Link href="/products" onClick={() => setIsMenuOpen(false)}>
                    Browse Products
                  </Link>
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                    Open Cart
                  </Link>
                </div>

                <nav aria-label="Mobile navigation" className="mobile-nav-list">
                  {menuItems.map((item) => {
                    if (!item.children?.length) {
                      return (
                        <Link
                          className={`mobile-nav-link ${item.featured ? "is-featured" : ""}`}
                          href={item.href}
                          key={item.id}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      );
                    }

                    const isOpen = openMobileSection === item.id;

                    return (
                      <div className="mobile-nav-group" key={item.id}>
                        <button
                          className={`mobile-nav-link mobile-nav-button ${
                            isOpen ? "is-open" : ""
                          }`}
                          onClick={() =>
                            setOpenMobileSection((current) =>
                              current === item.id ? null : item.id,
                            )
                          }
                          type="button"
                        >
                          <span>{item.label}</span>
                          <span className="mobile-nav-caret">{isOpen ? "-" : "+"}</span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div
                              animate={{ height: "auto", opacity: 1 }}
                              className="mobile-subnav is-open"
                              exit={{ height: 0, opacity: 0 }}
                              initial={{ height: 0, opacity: 0 }}
                            >
                              {item.children.map((child) => (
                                <Link
                                  className="mobile-subnav-link"
                                  href={child.href}
                                  key={child.href}
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
