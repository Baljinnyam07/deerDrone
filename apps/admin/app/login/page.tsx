"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "3rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}
        >
          DEER Admin
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Зөвхөн админ хандалттай.
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                color: "#94a3b8",
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
              }}
              placeholder="admin@gmail.com"
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                color: "#94a3b8",
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              НУУЦ ҮГ
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
              }}
              placeholder="........"
            />
          </div>

          {error ? (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: loading ? "#475569" : "#3b82f6",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
      </div>
    </div>
  );
}
