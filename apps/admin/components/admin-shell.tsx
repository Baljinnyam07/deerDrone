"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, section: "main" },
  { href: "/products", label: "Products", icon: Package, section: "main" },
  { href: "/orders", label: "Orders", icon: ShoppingCart, section: "main" },
  { href: "/chatbot", label: "Chatbot", icon: MessageSquare, section: "main" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin-root">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-logo">
              <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>🦌</span>
            </div>
            <div className="admin-brand-text">
              <h2>DEER Drone</h2>
              <span>Admin Panel</span>
            </div>
          </div>
          <button
            className="admin-mobile-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <span className="admin-nav-label">Main Menu</span>
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
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    {isActive && <div className="admin-nav-indicator" />}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="admin-nav-section" style={{ marginTop: "auto" }}>
            <div className="admin-nav-divider" />
            <Link href="/settings" className="admin-nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              <User size={18} />
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">Admin User</span>
              <span className="admin-user-role">Administrator</span>
            </div>
            <button className="admin-user-menu-btn">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
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
            <h1 className="admin-header-title">DEER Drone Admin</h1>
          </div>

          <div className="admin-header-center">
            <div className="admin-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="admin-search-input"
              />
            </div>
          </div>

          <div className="admin-header-end">
            <button className="admin-header-btn">
              <Bell size={20} />
              <span className="admin-notification-badge">3</span>
            </button>
            <div className="admin-header-user" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <div className="admin-header-avatar">
                <User size={18} />
              </div>
              <span className="admin-header-username">Admin</span>
            </div>
            {isUserMenuOpen && (
              <div className="admin-user-dropdown">
                <button className="admin-user-dropdown-item">
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button className="admin-user-dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="admin-user-dropdown-divider" />
                <button className="admin-user-dropdown-item">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
