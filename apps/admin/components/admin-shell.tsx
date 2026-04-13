"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Search,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";

const navItems = [
  { href: "/", label: "Хяналтын самбар", icon: LayoutDashboard, section: "main" },
  { href: "/products", label: "Бүтээгдэхүүн", icon: Package, section: "main" },
  { href: "/orders", label: "Захиалга", icon: ShoppingCart, section: "main" },
  { href: "/chatbot", label: "Чатбот", icon: MessageSquare, section: "main" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Initialize Supabase Browser Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh(); // Clear server-side caches
    } catch (err) {
      console.error("Logout error:", err);
      // Fallback for unexpected failures
      window.location.href = "/login";
    }
  };

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin-root">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-logo">
              <Image
                src="/brand/logo.svg"
                alt="Logo"
                width={36}
                height={36}
                priority
              />
            </div>
            <div className="admin-brand-text">
              <h2 className="admin-brand-name">DEER DRONE</h2>
              <span className="admin-brand-tagline">CONTROL PANEL</span>
            </div>
          </div>
          <button
            className="admin-mobile-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <span className="admin-nav-label">Үндсэн цэс</span>
            <div className="admin-nav-list">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-item ${isActive ? "is-active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="admin-nav-item-content">
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="admin-nav-indicator"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="admin-nav-section" style={{ marginTop: "auto" }}>
            <div className="admin-nav-divider" />
            <Link href="/settings" className={`admin-nav-item ${pathname === '/settings' ? 'is-active' : ''}`}>
              <div className="admin-nav-item-content">
                <Settings size={18} />
                <span>Тохиргоо</span>
              </div>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-wrapper">
        {/* Top Header */}
        <header className="admin-header">
          <button
            className="admin-menu-toggle"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="admin-header-start">
            <h1 className="admin-header-title">Хяналтын самбар</h1>
          </div>

          <div className="admin-header-center">
            <div
              className="admin-search-box"
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            >
              <Search size={16} />
              <div className="admin-search-input">
                Хайх... <kbd>⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="admin-header-end">
            <ThemeToggle />

            <button className="admin-header-btn">
              <Bell size={18} />
            </button>
            <div className="admin-header-user" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <div className="admin-header-avatar">
                <User size={16} />
              </div>
              <span className="admin-header-username">Админ</span>
              <ChevronDown size={14} style={{ opacity: 0.5 }} />
            </div>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="admin-user-dropdown"
                >
                  <button className="admin-user-dropdown-item">
                    <User size={14} />
                    <span>Профайл</span>
                  </button>
                  <div className="admin-user-dropdown-divider" />
                  <button
                    className="admin-user-dropdown-item"
                    style={{ color: 'var(--admin-danger)' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    <span>Гарах</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
