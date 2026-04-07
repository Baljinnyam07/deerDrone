"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const footerSections = [
  {
    title: "Танилцуулга",
    links: [
      { label: "Бидний тухай", href: "#" },
      { label: "Хамтран ажиллах", href: "#" },
      { label: "Салбар дэлгүүр", href: "#" },
      { label: "Ажлын байр", href: "#" },
    ],
  },
  {
    title: "Тусламж",
    links: [
      { label: "Үйлчилгээний нөхцөл", href: "#" },
      { label: "Нууцлалын бодлого", href: "#" },
      { label: "Хүргэлтийн нөхцөл", href: "#" },
    ],
  },
  {
    title: "Холбоо барих",
    links: [
      {
        label: "ecommerce@hobbyzone.mn",
        href: "mailto:ecommerce@hobbyzone.mn",
      },
      { label: "+976 7623-0000", href: "tel:+97676230000" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: "60px",
        paddingBottom: "24px",
        marginTop: "80px",
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
                  {link.href.startsWith("mailto:") ||
                  link.href.startsWith("tel:") ? (
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
            <MapPin size={16} style={{ color: "#2563EB" }} />
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
            River Tower 401 | River Garden 4th Mongol street, 11 khoroo,
            Khan-Uul district | Ulaanbaatar | Mongolia
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
          marginBottom: "24px",
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
      </div>
    </footer>
  );
}
