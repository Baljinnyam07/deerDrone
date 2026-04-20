"use client";

import { useState } from "react";
import { Loader2, CheckCircle, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
}

interface HeroProductSelectorProps {
  initialSlug: string | null;
  products: Product[];
}

export function HeroProductSelector({ initialSlug, products }: HeroProductSelectorProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "home_hero_product_slug",
          value: selectedSlug,
          label: "Нүүр хуудасны Бараа",
          description: "Нүүр хуудсан дээр том харагдах бүтээгдэхүүнийг сонгох"
        })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save hero product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-panel video-slot" style={{ borderTop: "4px solid var(--admin-primary)", marginTop: "32px", padding: "24px" }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div style={{ background: "rgba(37, 99, 235, 0.1)", color: "var(--admin-primary)", padding: "12px", borderRadius: "12px" }}>
          <Package size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 600 }}>Нүүр хуудасны харуулж буй Бараа</h3>
          <p className="admin-muted" style={{ marginBottom: "16px" }}>
            Дэлгэцийн хамгийн эхэнд Hero видеотой хамт гарч ирэх бүтээгдэхүүнийг сонгоно уу.
          </p>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              disabled={saving}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid var(--admin-border)",
                backgroundColor: "var(--admin-surface)",
                fontSize: "1rem"
              }}
            >
              <option value="">Сонгоно уу... (Сонгоогүй үед 2 дахь бараа автоматаар гарна)</option>
              {products.map(p => (
                <option key={p.id} value={p.slug}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={handleSave}
              disabled={saving}
              className="admin-primary-btn"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : (saved ? <CheckCircle size={16} /> : null)}
              <span>{saved ? "Хадгалагдсан" : "Хадгалах"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
