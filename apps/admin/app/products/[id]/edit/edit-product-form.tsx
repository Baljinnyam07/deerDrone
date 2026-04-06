"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${initialProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compare_price: form.compare_price ? Number(form.compare_price) : null,
          stock_qty: Number(form.stock_qty),
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
