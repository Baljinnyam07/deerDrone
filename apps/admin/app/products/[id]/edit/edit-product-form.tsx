"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export function EditProductForm({ categories, initialProduct }: { categories: any[]; initialProduct: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initialProduct.name,
    slug: initialProduct.slug,
    brand: initialProduct.brand,
    category_id: initialProduct.category_id || "",
    price: initialProduct.price.toString(),
    compare_price: initialProduct.compare_price?.toString() || "",
    stock_qty: initialProduct.stock_qty?.toString() || "0",
    short_description: initialProduct.short_description || "",
    description: initialProduct.description || "",
    hero_note: initialProduct.hero_note || "",
    is_leasable: initialProduct.is_leasable,
  });
  const defaultSpecs = Array.isArray(initialProduct?.specs) && initialProduct.specs.length > 0
    ? [...initialProduct.specs]
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map((spec: any) => ({
          label: spec.label || "",
          value: spec.value || "",
        }))
    : [{ label: "", value: "" }];

  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(defaultSpecs);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${initialProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            ...form,
            price: Number(form.price),
            compare_price: form.compare_price ? Number(form.compare_price) : null,
            stock_qty: Number(form.stock_qty),
          },
          specs: specs
            .map((spec) => ({
              label: spec.label.trim(),
              value: spec.value.trim(),
            }))
            .filter((spec) => spec.label && spec.value)
            .map((spec, index) => ({ ...spec, display_order: index })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Алдаа гарлаа");
      }

      router.push("/products");
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Энэ бүтээгдэхүүнийг бүр мөсөн устгах уу?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${initialProduct.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Устгаж чадсангүй");
      router.push("/products");
      router.refresh();
    } catch(err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>НЭР</label>
            <input required style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>URL SLUG</label>
            <input required style={inputStyle} value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>ҮНЭ (MNT)</label>
            <input required type="number" style={inputStyle} value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>ҮЛДЭГДЭЛ</label>
            <input required type="number" style={inputStyle} value={form.stock_qty} onChange={e => setForm({...form, stock_qty: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>КАТЕГОРИ</label>
            <select required style={inputStyle} value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>БОГИНО ТАЙЛБАР</label>
            <textarea required style={{ ...inputStyle, minHeight: "80px" }} value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>ДЭЛГЭРЭНГҮЙ ТАЙЛБАР</label>
            <textarea
              style={{ ...inputStyle, minHeight: "150px" }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Мөр тус бүрээр мэдээллээ оруулбал web дээр зөв форматтай харагдана."
            />
          </div>
      </div>

      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          Бүтээгдэхүүний үзүүлэлт
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {specs.map((spec, index) => (
            <div key={`spec-${index}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem" }}>
              <input
                style={inputStyle}
                value={spec.label}
                placeholder="Үзүүлэлтийн нэр"
                onChange={(e) => {
                  const next = [...specs];
                  next[index].label = e.target.value;
                  setSpecs(next);
                }}
              />
              <input
                style={inputStyle}
                value={spec.value}
                placeholder="Утга"
                onChange={(e) => {
                  const next = [...specs];
                  next[index].value = e.target.value;
                  setSpecs(next);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (specs.length === 1) {
                    setSpecs([{ label: "", value: "" }]);
                    return;
                  }
                  setSpecs(specs.filter((_, i) => i !== index));
                }}
                style={{
                  width: "42px",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  background: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Үзүүлэлт устгах"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecs([...specs, { label: "", value: "" }])}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "1px solid #cbd5e1",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >
            <Plus size={16} /> Мөр нэмэх
          </button>
        </div>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", borderTop: "1px solid #eee", paddingTop: "2rem" }}>
        <button type="button" disabled={loading} onClick={handleDelete} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer" }}>Устгах</button>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="button" onClick={() => router.back()} style={{ background: "none", border: "1px solid #ccc", padding: "12px 24px", borderRadius: "8px", cursor: "pointer" }}>Буцах</button>
          <button type="submit" disabled={loading} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "12px 32px", borderRadius: "8px", cursor: "pointer" }}>Хадгалах</button>
        </div>
      </div>
    </form>
  );
}

const inputStyle = { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" };
const labelStyle = { display: "block", marginBottom: "6px", fontSize: "0.8rem", color: "#666" };
