"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

type FooterLink = { label: string; href: string; action?: string; };

const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: "Танилцуулга",
    links: [
      { label: "Бидний тухай", href: "/about" },
      { label: "Холбоо барих", href: "#", action: "contact" },
    ],
  },
  {
    title: "Тусламж",
    links: [
      { label: "Үйлчилгээний нөхцөл", href: "/help/terms" },
      { label: "Нууцлалын бодлого", href: "/help/privacy" },
      { label: "Хамтран ажиллах", href: "/help/cooperate" },
      { label: "Хүргэлтийн нөхцөл", href: "/help/delivery" },
    ],
  },
];

export function SiteFooter() {
  const pathname = usePathname();
  const [isContactOpen, setIsContactOpen] = useState(false);

  if (pathname === "/cart" || pathname === "/checkout") return null;

  return (
    <footer
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: "40px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "48px",
          marginBottom: "48px",
        }}
      >
        {/* Logo & Social */}
        <div>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              marginBottom: "24px",
            }}
          >
            <Image
              alt="DEER droneshop"
              src="/assets/brand/deer-logo.svg"
              width={100}
              height={40}
              style={{ width: "auto", height: "40px" }}
            />
          </Link>

          {/* Social Icons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <a
              aria-label="Facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#F8FAFC",
                color: "#94A3B8",
                textDecoration: "none",
                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0F4FF";
                e.currentTarget.style.color = "#2563EB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F8FAFC";
                e.currentTarget.style.color = "#94A3B8";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h3z" />
              </svg>
            </a>

            <a
              aria-label="Instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#F8FAFC",
                color: "#94A3B8",
                textDecoration: "none",
                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0F4FF";
                e.currentTarget.style.color = "#2563EB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F8FAFC";
                e.currentTarget.style.color = "#94A3B8";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <circle cx="17.5" cy="6.5" r="1.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer Sections */}
        {footerSections.map((section) => (
          <div key={section.title}>
            <h6
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "16px",
              }}
            >
              {section.title}
            </h6>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {section.links.map((link) => (
                <li key={link.label}>
                  {link.action === "contact" ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsContactOpen(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: "0.9rem",
                        color: "#64748B",
                        textDecoration: "none",
                        transition: "color 250ms",
                        cursor: "pointer",
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#2563EB")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#64748B")
                      }
                    >
                      {link.label}
                    </button>
                  ) : link.href.startsWith("mailto:") || link.href.startsWith("tel:") ? (
                    <a
                      href={link.href}
                      style={{
                        fontSize: "0.9rem",
                        color: "#64748B",
                        textDecoration: "none",
                        transition: "color 250ms",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#2563EB")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#64748B")
                      }
                    >
                      {link.href.startsWith("mailto:") ? (
                        <Mail size={14} />
                      ) : (
                        <Phone size={14} />
                      )}
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "0.9rem",
                        color: "#64748B",
                        textDecoration: "none",
                        transition: "color 250ms",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#2563EB")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#64748B")
                      }
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Address Section */}
        <div>
          <h6
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#0F172A",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Хаяг
          </h6>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#64748B",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Улаанбаатар хот, Хан-Уул дүүрэг, 15-р хороо
            Их наяд Плаза, Зүүн өндөр, 3-р давхар, 305 тоот
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          borderTop: "1px solid #E2E8F0",
          paddingTop: "24px",
          marginBottom: "36px",
        }}
      >
        <p
          style={{
            fontSize: "0.85rem",
            color: "#94A3B8",
            textAlign: "center",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} DEER Drone. Бүх эрхийг хуулиар
          хамгаалагдсан.
        </p>
        <p style={{
            fontSize: "0.85rem",
            color: "#94A3B8",
            textAlign: "center",
            margin: 0,
          }}>Designed & built by Baljka × Ihaw</p>

      </div>

      {/* Smooth Animated Contact Drawer */}
      <div 
        className={`offcanvas-backdrop fade ${isContactOpen ? 'show' : ''}`} 
        style={{ 
          zIndex: 9998, 
          pointerEvents: isContactOpen ? 'auto' : 'none',
          display: isContactOpen ? 'block' : 'none',
          transition: 'opacity 0.3s ease'
        }}
        onClick={() => setIsContactOpen(false)}
      ></div>

      <div 
        tabIndex={-1} 
        style={{ 
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#fff',
          zIndex: 9999, 
          visibility: isContactOpen ? 'visible' : 'hidden', 
          transform: isContactOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), visibility 0.4s',
          boxShadow: isContactOpen ? '-15px 0 40px rgba(0,0,0,0.08)' : 'none',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="border-bottom py-4 px-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0" style={{ letterSpacing: '-0.02em', color: '#1d1d1f' }}>Холбоо барих</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setIsContactOpen(false)}
            style={{ width: '0.8em', height: '0.8em' }}
          ></button>
        </div>
        
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <div className="mb-4">
            <h6 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.05rem' }}>Хаяг:</h6>
            <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              Улаанбаатар хот, Хан-Уул дүүрэг, 15-р хороо<br/>
              Их наяд Плаза, Зүүн өндөр, 3-р давхар, 305 тоот
            </p>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.05rem' }}>Утас:</h6>
            <p className="mb-1" style={{ fontSize: '0.95rem' }}>
              <span className="me-2">📞</span>
              <a href="tel:88157242" className="text-decoration-none text-secondary">8815-7242</a>
            </p>
            <p className="mb-0" style={{ fontSize: '0.95rem' }}>
              <span className="me-2">📞</span>
              <a href="tel:99977242" className="text-decoration-none text-secondary">9997-7242</a>
            </p>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.05rem' }}>Имэйл:</h6>
            <p className="mb-0" style={{ fontSize: '0.95rem' }}>
              <span className="me-2">📧</span>
              <a href="mailto:deer.drone.shop@gmail.com" className="text-decoration-none text-secondary">Deer.Drone.Shop@gmail.com</a>
            </p>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.05rem' }}>Ажлын цаг:</h6>
            <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Даваа – Ням: 11:00 – 19:00</p>
          </div>

          {/* Google Map Embedded */}
          <div className="rounded-3 overflow-hidden w-100 mt-5" style={{ height: '220px', border: '1px solid #f0f0f0' }}>
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
    </footer>
  );
}
