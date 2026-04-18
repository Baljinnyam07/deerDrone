"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bgRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/help/terms", label: "Үйлчилгээний нөхцөл" },
    { href: "/help/privacy", label: "Нууцлалын бодлого" },
    { href: "/help/cooperate", label: "Хамтран ажиллах" },
    { href: "/help/delivery", label: "Хүргэлтийн нөхцөл" },
  ];

  useEffect(() => {
    // Background is now static fixed, no scroll listener needed.
  }, []);

  return (
    <div className="help-layout-wrapper">
      {/* Cinematic Dark Background Specific to Drones */}
      <div className="help-fixed-bg" ref={bgRef} />
      
      <div className="help-main-container">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="row g-4 g-lg-5">
            {/* Sidebar with Premium Glass Effect */}
            <div className="col-lg-3">
              <div className="help-sidebar-sticky">
                <h2 className="help-sidebar-title">Тусламж</h2>
                <nav className="help-sidebar-nav">
                  {links.map(link => {
                    const isActive = pathname === link.href;
                    return (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        className={`help-nav-link ${isActive ? 'active' : ''}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area with Dark Glassmorphism */}
            <div className="col-lg-9">
              <div className="help-content-card">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .help-layout-wrapper {
          position: relative;
          min-height: 100vh;
          background-color: #000;
          color: #fff;
          font-family: 'TT Norms Pro', sans-serif;
          overflow-x: hidden;
          clip-path: inset(0); /* Traps the fixed background so it doesn't bleed into the footer */
        }

        .help-fixed-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-image: 
            linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%),
            url('https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=2000&q=80');
          background-size: cover;
          background-position: center;
          z-index: 1;
          filter: brightness(0.8) contrast(1.2) saturate(1.1);
        }

        .help-main-container {
          position: relative;
          z-index: 2;
          padding-top: 140px;
          padding-bottom: 120px;
        }

        .help-sidebar-sticky {
          position: sticky;
          top: 120px;
        }

        .help-sidebar-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 2rem;
          background: linear-gradient(to right, #fff, rgba(255,255,255,0.5));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .help-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .help-nav-link {
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          padding: 16px 24px;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 600;
          background: rgba(255,255,255,0.001);
          border: 1px solid rgba(255,255,255,0.01);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          backdrop-filter: blur(10px);
        }

        .help-nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.1);
          transform: translateX(8px);
        }

        .help-nav-link.active {
          color: #fff;
          border-color: #777777ff;
        }

        .help-content-card {
          background: rgba(66, 66, 66, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 40px;
          padding: 60px;
          min-height: 60vh;
          animation: helpFadeUp 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        @keyframes helpFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Content Styling */
        .help-content-card h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 3rem;
          letter-spacing: -0.05em;
          color: #fff;
        }

        .help-content-card h6 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .help-content-card p {
          color: rgba(255,255,255,0.7);
          font-size: 1.15rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        @media (max-width: 991px) {
          .help-main-container { padding-top: 100px; padding-bottom: 60px; }
          .help-sidebar-sticky { position: static; margin-bottom: 2rem; }
          .help-sidebar-nav { flex-direction: row; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
          .help-sidebar-nav::-webkit-scrollbar { display: none; }
          .help-nav-link { white-space: nowrap; padding: 12px 20px; font-size: 1rem; }
          .help-content-card { padding: 40px 24px; border-radius: 24px; }
          .help-content-card h1 { font-size: 2rem; }
        }
      `}} />
    </div>
  );
}
