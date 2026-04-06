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

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header
        className={`fixed-top transition-all duration-300 ${
          isHomePage
            ? isScrolled
              ? "bg-white border-bottom shadow-sm py-2"
              : "bg-transparent py-3"
            : "bg-white border-bottom shadow-sm py-2"
        }`}
        style={{
          backdropFilter: isScrolled || !isHomePage ? "blur(30px)" : "none",
          backgroundColor:
            isScrolled || !isHomePage ? "rgba(255,255,255,0.85)" : "transparent",
          zIndex: 1050,
        }}
      >
        <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
          <Link href="/" className="d-flex align-items-center text-decoration-none">
            <Image
              alt="DEER"
              src="/assets/brand/deer-logo.svg"
              width={100}
              height={28}
              style={{ filter: !isScrolled && isHomePage ? "invert(1)" : "none", width: "auto", height: "28px" }}
              priority
            />
          </Link>

          <nav className="d-none d-lg-flex align-items-center gap-5 position-absolute start-50 translate-middle-x">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-decoration-none fw-medium small transition-colors ${
                  !isScrolled && isHomePage
                    ? "text-white hover-opacity-75"
                    : "text-dark-blue hover-text-primary"
                }`}
                style={{ letterSpacing: "0.5px" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="d-flex align-items-center gap-4">
            <button
              className={`btn btn-link p-0 ${
                !isScrolled && isHomePage ? "text-white" : "text-dark-blue text-dark"
              }`}
              onClick={() => setIsSearchOpen(true)}
              type="button"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
            <Link
              href={user ? "/account" : "/login"}
              className={`btn btn-link p-0 d-flex align-items-center gap-2 text-decoration-none ${
                !isScrolled && isHomePage ? "text-white" : "text-dark-blue text-dark"
              }`}
            >
              <User size={22} strokeWidth={1.5} />
            </Link>
            <Link
              href="/cart"
              className={`position-relative btn btn-link p-0 ${
                !isScrolled && isHomePage ? "text-white" : "text-dark-blue text-dark"
              }`}
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              {mounted && cartItemCount > 0 ? (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                  style={{ fontSize: "0.6rem", padding: "0.3em 0.5em" }}
                >
                  {cartItemCount}
                </span>
              ) : null}
            </Link>
            <button
              className={`btn btn-link p-0 d-lg-none ${
                !isScrolled && isHomePage ? "text-white" : "text-dark-blue text-dark"
              }`}
              onClick={() => setIsMenuOpen(true)}
              type="button"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {!isHomePage ? <div style={{ height: "65px" }} /> : null}

      <AnimatePresence>
        {isMenuOpen ? (
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
                  <X className="w-5 h-5" />
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
        ) : null}
      </AnimatePresence>
    </>
  );
}
