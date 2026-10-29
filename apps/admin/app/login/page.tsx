"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="login-page">
      <main className="login-card">
        <div className="login-brand">
          <Image src="/brand/logo.svg" alt="Deer Drone" width={48} height={48} priority />
          <h1>Нэвтрэх</h1>
          <p>DEER Drone удирдлагын самбар</p>
        </div>

        <form onSubmit={handleLogin} className="login-form" noValidate={false}>
          <label className="login-field">
            <span>Имэйл хаяг</span>
            <input
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@deerdrone.mn"
            />
          </label>

          <label className="login-field">
            <span>Нууц үг</span>
            <div className="login-password">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Нууц үгээ оруулна уу"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харуулах"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
      </main>

      <p className="login-footer">© {new Date().getFullYear()} DEER Drone</p>
    </div>
  );
}
