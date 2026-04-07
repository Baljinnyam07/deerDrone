"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Shield, Zap, Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F8FAFC 0%, #F0F4FF 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "16px",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          padding: "10px 16px",
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          color: "#64748B",
          fontSize: "0.9rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#F0F4FF";
          e.currentTarget.style.borderColor = "#2563EB";
          e.currentTarget.style.color = "#2563EB";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#F8FAFC";
          e.currentTarget.style.borderColor = "#E2E8F0";
          e.currentTarget.style.color = "#64748B";
        }}
      >
        ← Буцах
      </button>

      {/* Main Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "64px",
            height: "64px",
            background: "#F0F4FF",
            border: "2px solid #E0E7FF",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: "28px",
          }}
        >
          🦌
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#0F172A",
            margin: "0 0 8px",
            letterSpacing: "-0.01em",
          }}
        >
          DEER Admin
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#64748B",
            margin: "0 0 32px",
          }}
        >
          Админ панель руу нэвтрэх
        </p>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#0F172A",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Имэйл хаяг
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@deersdrone.mn"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                background: "#F8FAFC",
                fontSize: "14px",
                color: "#0F172A",
                outline: "none",
                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(37, 99, 235, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.background = "#F8FAFC";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#0F172A",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Нууц үг
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 16px",
                  paddingRight: "44px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  background: "#F8FAFC",
                  fontSize: "14px",
                  color: "#0F172A",
                  outline: "none",
                  transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2563EB";
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.background = "#F8FAFC";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  color: "#64748B",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748B";
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "#EF4444",
              }}
            >
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 20px",
              background: loading
                ? "#CBD5E1"
                : "linear-gradient(135deg, #2563EB, #1D4ED8)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 15px rgba(37, 99, 235, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <LogIn size={16} />
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "#E2E8F0",
            margin: "28px 0",
          }}
        />

        {/* Trust Indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
          >
            <Shield
              size={18}
              style={{ color: "#2563EB", flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0F172A",
                  margin: "0 0 2px",
                }}
              >
                Байлалтай аюулгүй
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  margin: 0,
                }}
              >
                Өндөр түвшний нэмэлт хэмжээ
              </p>
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
          >
            <Zap
              size={18}
              style={{ color: "#F59E0B", flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0F172A",
                  margin: "0 0 2px",
                }}
              >
                Хэдэв нэвтэрэх
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748B",
                  margin: 0,
                }}
              >
                Агшин зуур хандалт
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <p
        style={{
          marginTop: "32px",
          fontSize: "12px",
          color: "#94A3B8",
          textAlign: "center",
        }}
      >
        © 2024 DEER Drone. Бүх эрх хуулиар хамгаалагдсан.
      </p>

      {/* Development Test Credentials */}
      <div
        style={{
          marginTop: "24px",
          padding: "12px 16px",
          background: "#F0F4FF",
          border: "1px solid #E0E7FF",
          borderRadius: "8px",
          fontSize: "11px",
          color: "#64748B",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#2563EB" }}>
          Туршилтын хандалт:
        </p>
        <p style={{ margin: "0 0 4px" }}>
          <span style={{ fontWeight: 600 }}>Имэйл:</span> admin@deersdrone.mn
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ fontWeight: 600 }}>Нууц үг:</span> Supabase хэрэглэгч
          үүсгэ
        </p>
      </div>
    </div>
  );
}
