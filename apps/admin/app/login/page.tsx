"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Shield, Zap, Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";

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

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Нэвтрэх мэдээлэл буруу байна.");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err: any) {
      console.error("Login unexpected error:", err);
      setError("Системд алдаа гарлаа. Дараа дахин оролдоно уу.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--admin-surface)",
        fontFamily: "var(--font-body)",
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
          background: "white",
          border: "1px solid var(--admin-border)",
          borderRadius: "8px",
          color: "var(--admin-text-secondary)",
          fontSize: "0.9rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "var(--admin-transition)",
        }}
      >
        ← Буцах
      </button>

      {/* Main Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid var(--admin-border)",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "var(--admin-shadow-lg)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "64px",
            height: "64px",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <Image src="/brand/logo.svg" alt="Deer Drone" width={56} height={56} priority />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--admin-text)",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-display)",
            textAlign: "center"
          }}
        >
          DEER DRONE
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "var(--admin-muted)",
            margin: "0 0 32px",
            textAlign: "center"
          }}
        >
          Удирдлагын системд нэвтрэх
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
                color: "var(--admin-text)",
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
                border: "1px solid var(--admin-border)",
                background: "var(--admin-surface)",
                fontSize: "14px",
                color: "var(--admin-text)",
                outline: "none",
                transition: "var(--admin-transition)",
                boxSizing: "border-box",
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
                color: "var(--admin-text)",
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
                  border: "1px solid var(--admin-border)",
                  background: "var(--admin-surface)",
                  fontSize: "14px",
                  color: "var(--admin-text)",
                  outline: "none",
                  transition: "var(--admin-transition)",
                  boxSizing: "border-box",
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
                  color: "var(--admin-muted)",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "var(--admin-transition)",
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
                color: "var(--admin-danger)",
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
                ? "var(--admin-muted)"
                : "var(--admin-primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "var(--admin-transition)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
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
            background: "var(--admin-border-subtle)",
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
              style={{ color: "var(--admin-primary)", flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--admin-text)",
                  margin: "0 0 2px",
                }}
              >
                Аюулгүй хандалт
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--admin-muted)",
                  margin: 0,
                }}
              >
                Төгсгөлөөс төгсгөл хүртэлх хамгаалалт
              </p>
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
          >
            <Zap
              size={18}
              style={{ color: "var(--admin-warning)", flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--admin-text)",
                  margin: "0 0 2px",
                }}
              >
                Хурдан нэвтрэлт
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--admin-muted)",
                  margin: 0,
                }}
              >
                Хүлээгдэлгүй гүйцэтгэл
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
          color: "var(--admin-muted)",
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
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          borderRadius: "8px",
          fontSize: "11px",
          color: "var(--admin-muted)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <p style={{ margin: "0 0 6px", fontWeight: 600, color: "var(--admin-primary)" }}>
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
