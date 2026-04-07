"use client";

import Link from "next/link";
import { loginWithFacebook } from "../actions";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Zap } from "lucide-react";

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        backgroundColor: "#FFFFFF",
        background: "linear-gradient(135deg, #F8FAFC 0%, #F0F4FF 100%)",
      }}
    >
      {/* Top Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: "#64748B",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F0F4FF";
            e.currentTarget.style.color = "#2563EB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#F8FAFC";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          <ArrowLeft size={16} />
          Буцах
        </Link>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px 32px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <motion.div
            initial={{ rotate: -15, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F0F4FF",
              borderRadius: "12px",
              border: "1px solid #E0E7FF",
            }}
          >
            <img
              alt="DEER"
              src="/assets/brand/deer-logo.svg"
              style={{
                width: "40px",
                height: "auto",
                filter: "hue-rotate(200deg) brightness(1.2)",
              }}
            />
          </motion.div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            DEER Drone
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#64748B",
              margin: 0,
            }}
          >
            Нүүр хуудас руу нэвтэрнэ үү
          </p>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#0F172A",
              marginBottom: "8px",
            }}
          >
            Тавтай морил
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#64748B",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Захиалгыг түүхээ удирдахын тулд нэвтэрнэ үү
          </p>
        </div>

        {/* Login Button */}
        <form action={loginWithFacebook} style={{ marginBottom: "24px" }}>
          <button
            type="submit"
            style={{
              width: "100%",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              backgroundColor: "#1877F2",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0A66C2";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1877F2";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FacebookIcon size={18} />
            Facebook-ээр үргэлжлүүлэх
          </button>
        </form>

        {/* Trust Indicators */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingTop: "24px",
            borderTop: "1px solid #E2E8F0",
          }}
        >
          {[
            { icon: Shield, text: "Байлалтай аюулгүй", desc: "Facebook баталгаатай" },
            { icon: Zap, text: "Хэдэв нэвтэрэх", desc: "Нэг товшилтын нэвтэрэлт" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F0F4FF",
                  borderRadius: "8px",
                  color: "#2563EB",
                }}
              >
                <item.icon size={16} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0F172A",
                  }}
                >
                  {item.text}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#94A3B8",
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          marginTop: "32px",
          textAlign: "center",
          padding: "0 32px",
          maxWidth: "400px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#94A3B8",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Нэвтэрч орсноор та манай{" "}
          <Link
            href="/terms"
            style={{
              color: "#2563EB",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Үйлчилгээний нөхцөл
          </Link>{" "}
          болон{" "}
          <Link
            href="/privacy"
            style={{
              color: "#2563EB",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Нууцлалын бодлого
          </Link>
          -ыг зөвшөөрч байгаа болно.
        </p>
      </motion.div>
    </div>
  );
}
