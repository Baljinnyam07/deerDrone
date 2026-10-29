"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type FooterLink = { label: string; href: string; action?: "contact"; external?: boolean };

const footerColumns: { title: string; links: FooterLink[] }[][] = [
  [
    {
      title: "Бүтээгдэхүүн",
      links: [
        { label: "Дрон", href: "/products?category=drones" },
        { label: "Камер", href: "/products?category=cameras" },
        { label: "Гар төхөөрөмж", href: "/products?category=handheld" },
        { label: "Power", href: "/products?category=power" },
        { label: "Дагалдах хэрэгсэл", href: "/products?category=accessories" },
      ],
    },
  ],
  [
    {
      title: "Худалдан авалт",
      links: [
        { label: "Онлайн дэлгүүр", href: "/products?category=drones" },
        { label: "Сагс", href: "/cart" },
        { label: "Хүргэлтийн нөхцөл", href: "/help/delivery" },
      ],
    },
    {
      title: "Хамтын ажиллагаа",
      links: [{ label: "Хамтран ажиллах", href: "/help/cooperate" }],
    },
  ],
  [
    {
      title: "Тусламж",
      links: [
        { label: "Холбоо барих", href: "#", action: "contact" },
        { label: "Үйлчилгээний нөхцөл", href: "/help/terms" },
        { label: "Нууцлалын бодлого", href: "/help/privacy" },
      ],
    },
  ],
  [
    {
      title: "Бидний тухай",
      links: [
        { label: "DEER Drone", href: "/about" },
        { label: "Facebook", href: "https://www.facebook.com/Deerdroneshop2", external: true },
        { label: "Instagram", href: "https://www.instagram.com/deer_drone_shop/", external: true },
      ],
    },
  ],
  [
    {
      title: "Холбоо барих",
      links: [
        { label: "8815-7242", href: "tel:88157242" },
        { label: "9997-7242", href: "tel:99977242" },
        { label: "Deer.Drone.Shop@gmail.com", href: "mailto:deer.drone.shop@gmail.com" },
        { label: "Даваа – Ням: 11:00 – 19:00", href: "#", action: "contact" },
      ],
    },
  ],
];

function FooterAnchor({ link, onContact }: { link: FooterLink; onContact: () => void }) {
  if (link.action === "contact") {
    return (
      <button type="button" className="dj-footer-link" onClick={onContact}>
        {link.label}
      </button>
    );
  }
  if (link.external || link.href.startsWith("tel:") || link.href.startsWith("mailto:")) {
    return (
      <a href={link.href} {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {link.label}
      </a>
    );
  }
  return <Link href={link.href}>{link.label}</Link>;
}

export function SiteFooter() {
  const pathname = usePathname();
  const [isContactOpen, setIsContactOpen] = useState(false);

  if (pathname === "/cart" || pathname === "/checkout") return null;

  const openContact = () => setIsContactOpen(true);

  return (
    <footer className="dj-footer">
      <div className="dj-footer-cta">
        <h3>Зөвлөгөө авмаар байна уу?</h3>
        <p>Манай мэргэжилтнүүд танд тохирох DJI бүтээгдэхүүнийг сонгоход туслана.</p>
        <button type="button" className="dj-btn dj-btn-lg" onClick={openContact}>
          Холбоо барих
        </button>
      </div>

      <div className="dj-footer-cols">
        {footerColumns.map((column, i) => (
          <div key={i}>
            {column.map((section) => (
              <React.Fragment key={section.title}>
                <h6>{section.title}</h6>
                <ul>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <FooterAnchor link={link} onContact={openContact} />
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      <div className="dj-footer-bottom">
        <div className="dj-footer-bottom-left">
          <Link href="/" aria-label="DEER Drone">
            <Image alt="DEER Drone" src="/assets/brand/deer-logo.svg" width={90} height={24} />
          </Link>
          <Link href="/about">Бидний тухай</Link>
          <button type="button" className="dj-footer-link" onClick={openContact}>Холбоо барих</button>
          <Link href="/help/cooperate">Хамтран ажиллах</Link>
        </div>
        <div className="dj-footer-social">
          <a aria-label="Facebook" href="https://www.facebook.com/Deerdroneshop2" target="_blank" rel="noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a aria-label="Instagram" href="https://www.instagram.com/deer_drone_shop/" target="_blank" rel="noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
          </a>
        </div>
      </div>

      <div className="dj-footer-legal">
        <Link href="/help/privacy">Нууцлалын бодлого</Link>
        <span>·</span>
        <Link href="/help/terms">Үйлчилгээний нөхцөл</Link>
        <span>·</span>
        <Link href="/help/delivery">Хүргэлтийн нөхцөл</Link>
        <span style={{ flexBasis: "100%" }} />
        <span>© {new Date().getFullYear()} DEER Drone. Бүх эрх хуулиар хамгаалагдсан. · Улаанбаатар, Хан-Уул дүүрэг, Их Наяд Плаза, Зүүн өндөр, 3 давхар, 305 тоот</span>
        <span>Designed &amp; built by Baljka × Ihaw</span>
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
