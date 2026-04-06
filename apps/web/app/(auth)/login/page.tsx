"use client";

import Link from "next/link";
import { loginWithFacebook } from "../actions";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Sparkles, Zap, ChevronRight } from "lucide-react";

/**
 * Premium Facebook Icon Svg
 */
const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function LoginPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center overflow-hidden position-relative" style={{ backgroundColor: "#080808" }}>
      
      {/* Dynamic Background Glows */}
      <div 
        className="position-absolute" 
        style={{ 
          top: "-10%", 
          right: "-5%", 
          width: "60vw", 
          height: "60vw", 
          background: "radial-gradient(circle, rgba(0, 153, 255, 0.08) 0%, transparent 70%)", 
          filter: "blur(60px)",
          zIndex: 0
        }} 
      />
      <div 
        className="position-absolute" 
        style={{ 
          bottom: "-10%", 
          left: "-5%", 
          width: "50vw", 
          height: "50vw", 
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)", 
          filter: "blur(60px)",
          zIndex: 0
        }} 
      />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5 col-xl-4 text-sans-serif">
            
            {/* Top Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-5"
            >
              <Link
                href="/"
                className="text-decoration-none d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill transition-all"
                style={{ 
                  backgroundColor: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.85rem"
                }}
              >
                <ArrowLeft size={14} /> Нүүр хуудас руу буцах
              </Link>
            </motion.div>

            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-5"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
            >
              <div className="text-center mb-5">
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mb-4 d-inline-block p-4 rounded-4"
                  style={{ backgroundColor: "rgba(0,153,255,0.1)", border: "1px solid rgba(0,153,255,0.2)" }}
                >
                  <img
                    alt="DEER Drone"
                    src="/assets/brand/deer-logo.svg"
                    width="48"
                    height="48"
                    style={{ filter: "invert(1) brightness(1.5)" }}
                  />
                </motion.div>
                
                <h1 className="text-white fw-bold mb-2" style={{ fontSize: "2.2rem", letterSpacing: "-0.04em" }}>
                  DEER DRONE
                </h1>
                <p className="small text-uppercase fw-semibold" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}>
                  Premium Creator Hub
                </p>
              </div>

              <div className="mb-5 text-center">
                <h4 className="text-white mb-2 fw-medium">Тавтай морил</h4>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
                  Бүтээгдэхүүн болон захиалгын түүхээ <br /> удирдахын тулд нэвтэрнэ үү
                </p>
              </div>

              {/* Login Button Area */}
              <form action={loginWithFacebook}>
                <button
                  type="submit"
                  className="btn w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-3 transition-all"
                  style={{ 
                    backgroundColor: "#1877F2", 
                    color: "white", 
                    border: "none",
                    fontWeight: "600",
                    height: "60px",
                    boxShadow: "0 10px 20px -5px rgba(24, 119, 242, 0.4)"
                  }}
                >
                  <FacebookIcon size={22} />
                  Facebook-ээр үргэлжлүүлэх
                </button>
              </form>

              {/* Minimal Trust Assets */}
              <div className="mt-5 pt-4 d-flex flex-column gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { icon: Shield, text: "Secure Auth", desc: "Facebook Verified" },
                  { icon: Zap, text: "Instant Login", desc: "One-Click access" }
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle" style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className="fw-bold text-white small" style={{ fontSize: "0.8rem", opacity: 0.9 }}>{item.text}</div>
                      <div className="small" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-5 text-center px-4"
            >
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", lineHeight: 1.6 }}>
                Нэвтэрч орсноор та манай <Link href="/terms" className="text-white text-decoration-none fw-semibold">Үйлчилгээний нөхцөл</Link> болон <Link href="/privacy" className="text-white text-decoration-none fw-semibold">Нууцлалын бодлого</Link>-ыг зөвшөөрч байгаа болно.
              </p>
            </motion.div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          background-color: #080808 !important;
        }
        .btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
