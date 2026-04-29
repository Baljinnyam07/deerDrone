"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";

export function CreateProductForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    brand: "DJI",
    category_id: categories.length > 0 ? categories[0].id : "",
    price: "",
    compare_price: "",
    stock_qty: "10",
    short_description: "",
    description: "",
    hero_note: "",
    is_leasable: true,
  });

  const [specs, setSpecs] = useState([{ label: "", value: "" }]);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const filesArray = Array.from(event.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...filesArray]);
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  }

  async function uploadImage(file: File): Promise<string> {
    // 1. Get Authentication Parameters from our API
    const authRes = await fetch("/api/imagekit/auth");
    if (!authRes.ok) {
      throw new Error("ImageKit нэвтрэх эрх авахад алдаа гарлаа.");
    }
    const authParams = await authRes.json();

    // 2. Prepare FormData for ImageKit
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
    formData.append("signature", authParams.signature);
    formData.append("expire", authParams.expire.toString());
    formData.append("token", authParams.token);
    formData.append("folder", "/products/");

    // 3. Upload directly to ImageKit
    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}));
      throw new Error(errorData.message || "Зураг хуулах явцад алдаа гарлаа (ImageKit upload failed).");
    }

    const result = await uploadRes.json();
    return result.url as string;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const uploadedUrls = await Promise.all(images.map((image) => uploadImage(image.file)));

      const payload = {
        product: {
          ...form,
          price: Number(form.price),
          compare_price: form.compare_price ? Number(form.compare_price) : null,
          stock_qty: Number(form.stock_qty),
        },
        images: uploadedUrls.map((url, index) => ({ url, display_order: index })),
        specs: specs
          .filter((spec) => spec.label && spec.value)
          .map((spec, index) => ({ ...spec, display_order: index })),
      };

      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Барааг хадгалахад алдаа гарлаа");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/products");
        router.refresh();
      }, 1500);
    } catch (submitError: any) {
      setError(submitError.message);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ color: "#22c55e", marginBottom: "1rem" }}>Амжилттай хадгалагдлаа!</h2>
        <p className="admin-muted">Түр хүлээнэ үү...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          Үндсэн мэдээлэл
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>НЭР</label>
            <input
              required
              style={inputStyle}
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                  slug: event.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, ""),
                })
              }
              placeholder="DJI Mavic 3 Pro"
            />
          </div>
          <div>
            <label style={labelStyle}>URL SLUG</label>
            <input
              required
              style={inputStyle}
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              placeholder="dji-mavic-3-pro"
            />
          </div>
          <div>
            <label style={labelStyle}>БРЭНД</label>
            <input
              required
              style={inputStyle}
              value={form.brand}
              onChange={(event) => setForm({ ...form, brand: event.target.value })}
              placeholder="DJI"
            />
          </div>
          <div>
            <label style={labelStyle}>КАТЕГОРИ</label>
            <select
              required
              style={inputStyle}
              value={form.category_id}
              onChange={(event) => setForm({ ...form, category_id: event.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          Үнэ & Үлдэгдэл
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>ҮНЭ (MNT)</label>
            <input
              required
              type="number"
              style={inputStyle}
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
            />
          </div>
          <div>
            <label style={labelStyle}>ХУУЧИН ҮНЭ</label>
            <input
              type="number"
              style={inputStyle}
              value={form.compare_price}
              onChange={(event) => setForm({ ...form, compare_price: event.target.value })}
            />
          </div>
          <div>
            <label style={labelStyle}>АГУУЛАХЫН ҮЛДЭГДЭЛ</label>
            <input
              required
              type="number"
              style={inputStyle}
              value={form.stock_qty}
              onChange={(event) => setForm({ ...form, stock_qty: event.target.value })}
            />
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.is_leasable}
              onChange={(event) => setForm({ ...form, is_leasable: event.target.checked })}
            />
            Лизингээр авах боломжтой эсэх
          </label>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          Тайлбар
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>БОГИНО ТАЙЛБАР</label>
            <textarea
              required
              style={{ ...inputStyle, minHeight: "80px" }}
              value={form.short_description}
              onChange={(event) => setForm({ ...form, short_description: event.target.value })}
              placeholder="Хүчирхэг камертай мэргэжлийн дрон."
            />
          </div>
          <div>
            <label style={labelStyle}>ДЭЛГЭРЭНГҮЙ ТАЙЛБАР</label>
            <textarea
              style={{ ...inputStyle, minHeight: "150px" }}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Бүрэн дэлгэрэнгүй тайлбар..."
            />
          </div>
          <div>
            <label style={labelStyle}>ОНЦЛОХ ШОШГО</label>
            <input
              style={inputStyle}
              value={form.hero_note}
              onChange={(event) => setForm({ ...form, hero_note: event.target.value })}
              placeholder="Жишээ: Шинэ, Онцгой, Bestseller"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          Зураг оруулах
        </h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          {images.map((image, index) => (
            <div
              key={`${image.preview}-${index}`}
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-white"
            >
              <img src={image.preview} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 flex items-center justify-center transition"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <label
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "8px",
              border: "2px dashed #cbd5e1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
              background: "#f8fafc",
            }}
          >
            <Upload size={24} style={{ marginBottom: "0.5rem" }} />
            <span style={{ fontSize: "0.75rem" }}>Хуулах</span>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          Техник үзүүлэлтүүд
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {specs.map((spec, index) => (
            <div key={index} style={{ display: "flex", gap: "1rem" }}>
              <input
                style={inputStyle}
                value={spec.label}
                onChange={(event) => {
                  const nextSpecs = [...specs];
                  nextSpecs[index].label = event.target.value;
                  setSpecs(nextSpecs);
                }}
                placeholder="Үзүүлэлтийн нэр"
              />

              <input
                style={inputStyle}
                value={spec.value}
                onChange={(event) => {
                  const nextSpecs = [...specs];
                  nextSpecs[index].value = event.target.value;
                  setSpecs(nextSpecs);
                }}
                placeholder="Утга"
              />
              <button
                type="button"
                onClick={() => {
                  if (specs.length === 1) {
                    setSpecs([{ label: "", value: "" }]);
                    return;
                  }
                  setSpecs(specs.filter((_, specIndex) => specIndex !== index));
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

      {error ? (
        <div style={{ background: "#fee2e2", color: "#ef4444", padding: "1rem", borderRadius: "8px" }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "2rem" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ background: "none", border: "1px solid #cbd5e1", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
        >
          Буцах
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "12px 32px", borderRadius: "8px", cursor: loading ? "wait" : "pointer", fontWeight: 600 }}
        >
          {loading ? "Хадгалж байна..." : "Хадгалах"}
        </button>
      </div>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "0.95rem",
  outlineColor: "#3b82f6",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase" as const,
};
