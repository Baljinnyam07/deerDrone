"use client";

import { useEffect, useMemo, useState } from "react";
import { safeMoney } from "../../lib/format";
import { AdminDrawer } from "../../components/ui/admin-drawer";
import { AdminDialog } from "../../components/ui/admin-dialog";
import { ActionMenu } from "../../components/ui/action-menu";
import { AdminButton } from "../../components/ui/admin-button";
import { useToast } from "../../components/ui/toast";
import { ImageUploader } from "../../components/ui/image-uploader";
import { Plus, Edit2, Trash2, Package, Info, Search, ExternalLink, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductsClientProps {
  initialProducts: any[];
  categories: Array<{ id: string; name: string }>;
  siteUrl: string;
  /** From ?stock= (dashboard links): "out" | "low" | "nospecs" */
  initialStockFilter?: string;
}

// Stock at or below this (but above 0) is shown as "running low"
const LOW_STOCK = 2;

type StockFilter = "all" | "out" | "low" | "nospecs";
type SortKey = "newest" | "name" | "price_asc" | "price_desc" | "stock_asc";

const EMPTY_FORM = {
  name: "",
  slug: "",
  brand: "DJI",
  category_id: "",
  price: "",
  compare_price: "",
  stock_qty: "0",
  short_description: "",
  description: "",
  hero_note: "",
  is_leasable: true,
  search_keywords: "",
};

// Mongolian Cyrillic → Latin, so "Дрон цүнх" becomes "dron-tsunkh" instead of an empty slug
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "i",
  к: "k", л: "l", м: "m", н: "n", о: "o", ө: "u", п: "p", р: "r", с: "s", т: "t", у: "u",
  ү: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "y", ь: "i",
  э: "e", ю: "yu", я: "ya",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stockState(qty: number): "out" | "low" | "ok" {
  if (qty <= 0) return "out";
  if (qty <= LOW_STOCK) return "low";
  return "ok";
}

export function ProductsClient({ initialProducts, categories, siteUrl, initialStockFilter }: ProductsClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // List controls
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>(
    ["out", "low", "nospecs"].includes(initialStockFilter ?? "") ? (initialStockFilter as StockFilter) : "all"
  );
  const [sort, setSort] = useState<SortKey>("newest");

  // Form State
  const [formData, setFormData] = useState(EMPTY_FORM);
  // New products get an auto slug from the name until the slug is edited by hand
  const [slugTouched, setSlugTouched] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [specs, setSpecs] = useState<any[]>([]);

  // Pick up fresh server data after router.refresh()
  useEffect(() => setProducts(initialProducts), [initialProducts]);

  const counts = useMemo(() => ({
    all: products.length,
    out: products.filter((p) => stockState(p.stock_qty ?? 0) === "out").length,
    low: products.filter((p) => stockState(p.stock_qty ?? 0) === "low").length,
    nospecs: products.filter((p) => !p.specs?.length).length,
  }), [products]);

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (categoryId && p.category_id !== categoryId) return false;
      if (stockFilter === "out" && stockState(p.stock_qty ?? 0) !== "out") return false;
      if (stockFilter === "low" && stockState(p.stock_qty ?? 0) !== "low") return false;
      if (stockFilter === "nospecs" && p.specs?.length) return false;
      if (q) {
        const haystack = [p.name, p.slug, p.brand, p.search_keywords].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "name": sorted.sort((a, b) => String(a.name).localeCompare(String(b.name))); break;
      case "price_asc": sorted.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price_desc": sorted.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "stock_asc": sorted.sort((a, b) => (a.stock_qty ?? 0) - (b.stock_qty ?? 0)); break;
      default: break; // server already orders newest first
    }
    return sorted;
  }, [products, query, categoryId, stockFilter, sort]);

  const isFiltered = Boolean(query || categoryId || stockFilter !== "all");

  const clearFilters = () => {
    setQuery("");
    setCategoryId("");
    setStockFilter("all");
  };

  const handleOpenNew = () => {
    setSelectedProduct(null);
    setFormData({ ...EMPTY_FORM, category_id: categoryId || "" });
    setSlugTouched(false);
    setImages([]);
    setSpecs([]);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name ?? "",
      slug: product.slug ?? "",
      brand: product.brand ?? "",
      category_id: product.category_id || "",
      price: product.price?.toString() ?? "",
      compare_price: product.compare_price?.toString() ?? "",
      stock_qty: (product.stock_qty ?? 0).toString(),
      short_description: product.short_description || "",
      description: product.description || "",
      hero_note: product.hero_note || "",
      is_leasable: product.is_leasable ?? true,
      search_keywords: product.search_keywords || "",
    });
    // Existing products keep their URL: renaming must not silently change the link
    setSlugTouched(true);
    setImages(product.images || []);
    setSpecs(product.specs || []);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const openOnSite = (product: any) => {
    window.open(`${siteUrl}/products/${product.slug}`, "_blank", "noopener");
  };

  const updateStock = async (product: any, nextQty: number) => {
    const qty = Math.max(0, Math.round(nextQty));
    const previous = product.stock_qty ?? 0;
    if (qty === previous) return;

    // Optimistic: update the row now, roll back if the save fails
    setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, stock_qty: qty } : p)));
    try {
      const res = await fetch(`/api/products/${product.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_qty: qty }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Үлдэгдэл хадгалахад алдаа гарлаа");
      }
    } catch (err: any) {
      setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, stock_qty: previous } : p)));
      toast(err.message || "Үлдэгдэл хадгалахад алдаа гарлаа", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = formData.slug.trim() || slugify(formData.name);
    if (!formData.name.trim() || !slug || !formData.price) {
      toast("Нэр, хуудасны хаяг болон үнэ заавал шаардлагатай", "error");
      return;
    }

    setIsSaving(true);
    try {
      const url = selectedProduct ? `/api/products/${selectedProduct.id}` : "/api/products/create";
      const method = selectedProduct ? "PATCH" : "POST";

      const payload = {
        product: {
          ...formData,
          slug,
          price: parseFloat(formData.price),
          compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
          stock_qty: parseInt(formData.stock_qty) || 0,
        },
        images: images.map((img, idx) => ({
          url: img.url,
          display_order: img.display_order ?? idx
        })),
        specs: specs
          .map((spec, idx) => ({
            label: (spec.label || "").trim(),
            value: (spec.value || "").trim(),
            display_order: spec.display_order ?? idx,
          }))
          .filter((spec) => spec.label && spec.value),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Save failed");
      }

      toast(selectedProduct ? "Бүтээгдэхүүн амжилттай шинэчлэгдлээ" : "Шинэ бүтээгдэхүүн амжилттай нэмэгдлээ", "success");
      setIsDrawerOpen(false);
      router.refresh();
    } catch (err: any) {
      toast(err.message || "Хадгалахад алдаа гарлаа", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      toast("Бүтээгдэхүүн амжилттай устгагдлаа", "success");
      setIsDeleteDialogOpen(false);
      router.refresh();
    } catch (err) {
      toast("Устгахад алдаа гарлаа", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filterChips: { key: StockFilter; label: string; tone: string }[] = [
    { key: "all", label: "Нийт бараа", tone: "" },
    { key: "out", label: "Дууссан", tone: "danger" },
    { key: "low", label: "Цөөн үлдсэн", tone: "warning" },
  ];

  return (
    <>
      <article className="admin-panel">
        {/* Header with Action */}
        <div className="admin-panel-header" style={{ marginBottom: "16px" }}>
          <h2 style={{ margin: 0 }}>Бүх бүтээгдэхүүн</h2>
          <AdminButton icon={Plus} onClick={handleOpenNew} size="md">Шинэ нэмэх</AdminButton>
        </div>

        {/* Toolbar: search, category, sort */}
        <div className="products-toolbar">
          <div className="products-search">
            <Search size={16} className="products-search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="admin-input"
              placeholder="Нэр, түлхүүр үгээр хайх…"
              aria-label="Бүтээгдэхүүн хайх"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="admin-input products-select"
            aria-label="Ангиллаар шүүх"
          >
            <option value="">Бүх ангилал</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="admin-input products-select"
            aria-label="Эрэмбэлэх"
          >
            <option value="newest">Шинэ нь эхэндээ</option>
            <option value="name">Нэрээр (А–Я)</option>
            <option value="price_asc">Үнэ: багаас их</option>
            <option value="price_desc">Үнэ: ихээс бага</option>
            <option value="stock_asc">Үлдэгдэл: багаас их</option>
          </select>
        </div>

        {/* Summary cards double as quick filters */}
        <div className="products-summary" role="tablist" aria-label="Үлдэгдлээр шүүх">
          {filterChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              role="tab"
              aria-selected={stockFilter === chip.key}
              className={`products-stat ${chip.tone} ${stockFilter === chip.key ? "is-active" : ""}`}
              onClick={() => setStockFilter(chip.key)}
            >
              <span className="products-stat-value">{counts[chip.key]}</span>
              <span className="products-stat-label">{chip.label}</span>
            </button>
          ))}
        </div>

        <div className="products-result-row">
          <span>
            {visibleProducts.length} бараа харагдаж байна
            {isFiltered && (
              <button type="button" className="products-clear" onClick={clearFilters}>Шүүлтүүр цэвэрлэх</button>
            )}
          </span>
        </div>

        {/* Products Table */}
        <div className="admin-table">
          {/* Table Header */}
          <div className="admin-table-header cols-5-products">
            <div>Бүтээгдэхүүн</div>
            <div>Ангилал</div>
            <div>Үнэ</div>
            <div>Үлдэгдэл</div>
            <div className="admin-table-cell-align-center">Үйлдэл</div>
          </div>

          {visibleProducts.length === 0 && (
            <div className="products-empty">
              <Package size={20} />
              <p>{isFiltered ? "Шүүлтүүрт тохирох бараа олдсонгүй." : "Одоогоор бараа бүртгэгдээгүй байна."}</p>
              {isFiltered && (
                <button type="button" className="products-clear" onClick={clearFilters}>Шүүлтүүр цэвэрлэх</button>
              )}
            </div>
          )}

          {/* Product Rows */}
          {visibleProducts.map((product) => {
            const firstImage = [...(product.images || [])].sort((a: any, b: any) => a.display_order - b.display_order)[0];
            const qty = product.stock_qty ?? 0;
            const state = stockState(qty);
            return (
              <div
                key={product.id}
                className="admin-table-row cols-5-products"
                onClick={() => handleOpenEdit(product)}
              >
                {/* Product with Image & Name */}
                <div className="admin-table-cell-meta" style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div className="admin-table-thumbnail">
                    {firstImage ? (
                      <img src={firstImage.url} alt={product.name} />
                    ) : (
                      <Package size={18} className="admin-table-thumbnail-icon" />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="admin-table-cell-primary">{product.name}</div>
                    <div className="admin-table-cell-secondary">
                      {product.hero_note ? `${product.hero_note} · ` : ""}/{product.slug}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="text-sm">{product.category?.name || "—"}</div>

                {/* Price */}
                <div>
                  <div className="font-semibold">{safeMoney(product.price)}</div>
                  {product.compare_price ? (
                    <div className="products-compare-price">{safeMoney(product.compare_price)}</div>
                  ) : null}
                </div>

                {/* Stock — editable in place */}
                <div onClick={(e) => e.stopPropagation()}>
                  <StockEditor key={qty} qty={qty} state={state} onCommit={(n) => updateStock(product, n)} />
                </div>

                {/* Actions */}
                <div className="admin-table-actions" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu
                    items={[
                      { label: "Засах", icon: Edit2, onClick: () => handleOpenEdit(product) },
                      { label: "Сайтад харах", icon: ExternalLink, onClick: () => openOnSite(product) },
                      { label: "Устгах", icon: Trash2, onClick: () => handleDeleteClick(product), variant: "danger" },
                    ]}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <style jsx>{`
          .products-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 12px;
          }
          .products-search {
            position: relative;
            flex: 1 1 260px;
            min-width: 0;
          }
          .products-search :global(.products-search-icon) {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--admin-muted);
            pointer-events: none;
          }
          .products-search input {
            width: 100%;
            padding-left: 36px;
          }
          .products-select {
            flex: 0 1 190px;
            min-width: 150px;
          }
          .products-summary {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 14px;
          }
          .products-stat {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
            padding: 14px 16px;
            border: 1px solid var(--admin-border);
            border-radius: var(--admin-radius);
            background: var(--admin-card);
            color: var(--admin-text);
            text-align: left;
            cursor: pointer;
            transition: border-color 0.15s, background 0.15s;
          }
          .products-stat:hover { border-color: rgba(0, 0, 0, 0.22); }
          .products-stat.is-active {
            border-color: var(--admin-primary);
            background: rgba(31, 122, 224, 0.06);
          }
          .products-stat-value { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
          .products-stat-label { font-size: 0.8rem; color: var(--admin-text-secondary); }
          .products-stat.danger .products-stat-value { color: var(--admin-danger); }
          .products-stat.warning .products-stat-value { color: var(--admin-warning); }
          .products-result-row {
            margin-bottom: 12px;
            font-size: 0.8rem;
            color: var(--admin-muted);
          }
          .products-result-row .products-clear { margin-left: 10px; }
          @media (max-width: 720px) {
            .products-summary { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
          }
          .products-clear {
            border: none;
            background: none;
            color: var(--admin-primary);
            font-weight: 600;
            font-size: 0.8rem;
            cursor: pointer;
            padding: 0;
          }
          .products-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 40px 16px;
            color: var(--admin-muted);
            font-size: 0.9rem;
          }
          .products-empty p { margin: 0; }
          .products-compare-price {
            font-size: 0.75rem;
            color: var(--admin-muted);
            text-decoration: line-through;
          }
        `}</style>
      </article>

      {/* Product Drawer (Form) */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedProduct ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн нэмэх"}
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsDrawerOpen(false)}>Цуцлах</AdminButton>
            <AdminButton onClick={handleSave} isLoading={isSaving}>Хадгалах</AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="admin-form">
          {/* Images Section */}
          <div className="form-section">
            <h3 className="form-section-title">1. Зураг</h3>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          <div className="form-divider" />

          {/* Basic Info */}
          <div className="form-section">
            <h3 className="form-section-title">2. Үндсэн мэдээлэл</h3>
            <div className="form-group">
              <label>Нэр</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({ ...formData, name, ...(slugTouched ? {} : { slug: slugify(name) }) });
                }}
                required
                className="admin-input"
                placeholder="Бүтээгдэхүүний нэр..."
              />
            </div>

            <div className="form-group">
              <label>Хуудасны хаяг</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                required
                className="admin-input"
                placeholder="product-name-slug"
              />
              <p className="form-hint">
                {siteUrl.replace(/^https?:\/\//, "")}/products/{formData.slug || "…"}
                {selectedProduct ? " — өөрчилбөл хуучин холбоосууд ажиллахаа болино." : " — нэрээс автоматаар үүснэ."}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Ангилал</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="admin-input"
                >
                  <option value="">Ангилал сонгох</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Брэнд</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="admin-input"
                  placeholder="DJI, Potensic…"
                />
              </div>
            </div>
          </div>

          <div className="form-divider" />

          {/* Price & stock */}
          <div className="form-section">
            <h3 className="form-section-title">3. Үнэ ба үлдэгдэл</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "end" }}>
              <div className="form-group">
                <label>Үнэ (₮)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Хуучин үнэ (хямдралтай бол)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.compare_price}
                  onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })}
                  className="admin-input"
                  placeholder="Хоосон бол хямдралгүй"
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Үлдэгдэл</label>
                <input
                  type="number"
                  min={0}
                  value={formData.stock_qty}
                  onChange={(e) => setFormData({ ...formData, stock_qty: e.target.value })}
                  required
                  className="admin-input"
                />
              </div>
            </div>
            {formData.compare_price && Number(formData.compare_price) <= Number(formData.price) && (
              <p className="form-hint form-hint-warn">Хямдралын өмнөх үнэ одоогийн үнээс их байх ёстой.</p>
            )}
            <label className="form-check">
              <input
                type="checkbox"
                checked={formData.is_leasable}
                onChange={(e) => setFormData({ ...formData, is_leasable: e.target.checked })}
              />
              Лизингээр авах боломжтой
            </label>
          </div>

          <div className="form-divider" />

          {/* Details */}
          <div className="form-section">
            <h3 className="form-section-title">4. Тайлбар</h3>
            <div className="form-group">
              <label>Онцлох шошго (сонголттой)</label>
              <input
                type="text"
                value={formData.hero_note}
                onChange={(e) => setFormData({ ...formData, hero_note: e.target.value })}
                className="admin-input"
                placeholder="Жишээ: Шинэ, Онцгой, Bestseller"
              />
            </div>
            <div className="form-group">
              <label>Богино тайлбар</label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="admin-input"
                placeholder="Жишээ: Хүчирхэг камертай мэргэжлийн дрон."
              />
            </div>
            <div className="form-group">
              <label>Дэлгэрэнгүй тайлбар</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="admin-input"
                style={{ minHeight: "120px" }}
                placeholder="Барааны дэлгэрэнгүй мэдээлэл..."
              />
            </div>
            <div className="form-group">
              <label>Хайлтын түлхүүр үг</label>
              <textarea
                value={formData.search_keywords}
                onChange={(e) => setFormData({ ...formData, search_keywords: e.target.value })}
                className="admin-input"
                style={{ minHeight: "70px" }}
                placeholder="Таслалаар тусгаарлана. Жишээ: шилэн наалт, дэлгэц хамгаалагч, хатуу цүнх"
              />
              <p className="form-hint">Хэрэглэгч эдгээр үгээр хайхад (вэб сайт болон чатбот) энэ бараа гарч ирнэ.</p>
            </div>
          </div>

          <div className="form-divider" />

          {/* Specifications */}
          <div className="form-section">
            <h3 className="form-section-title">
              <Info size={14} />
              5. Техникийн үзүүлэлт
            </h3>

            <div className="spec-list">
              {specs.length === 0 ? (
                <p className="spec-empty">Одоогоор үзүүлэлт оруулаагүй байна. Чатбот харьцуулалт хийхдээ эдгээрийг ашигладаг.</p>
              ) : null}

              {specs.map((spec, index) => (
                <div key={`spec-${index}`} className="spec-row">
                  <input
                    type="text"
                    value={spec.label || ""}
                    onChange={(e) => {
                      const next = [...specs];
                      next[index] = { ...next[index], label: e.target.value };
                      setSpecs(next);
                    }}
                    className="admin-input"
                    placeholder="Үзүүлэлтийн нэр (ж: Нислэгийн хугацаа)"
                  />
                  <input
                    type="text"
                    value={spec.value || ""}
                    onChange={(e) => {
                      const next = [...specs];
                      next[index] = { ...next[index], value: e.target.value };
                      setSpecs(next);
                    }}
                    className="admin-input"
                    placeholder="Утга (ж: 45 минут)"
                  />
                  <button
                    type="button"
                    className="spec-remove-btn"
                    onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                    aria-label="Үзүүлэлт устгах"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="spec-add-btn"
              onClick={() => setSpecs([...specs, { label: "", value: "" }])}
            >
              <Plus size={14} />
              Үзүүлэлт нэмэх
            </button>
          </div>
        </form>

        <style jsx>{`
          .form-section {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .form-section-title {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--admin-text);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .form-divider {
            height: 1px;
            background: var(--admin-border-subtle);
            margin: 8px 0;
          }
          .form-hint {
            margin: 6px 0 0;
            font-size: 0.75rem;
            color: var(--admin-muted);
            word-break: break-all;
          }
          .form-hint-warn {
            margin-top: -8px;
            color: var(--admin-warning);
          }
          .form-check {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            cursor: pointer;
          }
          .spec-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .spec-row {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 10px;
            align-items: center;
          }
          .spec-empty {
            margin: 0;
            font-size: 0.85rem;
            color: var(--admin-muted);
          }
          .spec-add-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: 1px solid var(--admin-border);
            background: transparent;
            color: var(--admin-text);
            border-radius: 999px;
            padding: 8px 12px;
            font-weight: 600;
            cursor: pointer;
            width: fit-content;
          }
          .spec-remove-btn {
            width: 36px;
            height: 36px;
            border: 1px solid rgba(239, 68, 68, 0.35);
            color: var(--admin-danger);
            background: var(--admin-card);
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        `}</style>
      </AdminDrawer>

      {/* Delete Confirmation */}
      <AdminDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Устгахыг баталгаажуулах"
        variant="danger"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>Болих</AdminButton>
            <AdminButton variant="danger" onClick={confirmDelete} isLoading={isDeleting}>Устгах</AdminButton>
          </>
        }
      >
        Та <strong>{selectedProduct?.name}</strong>-г устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
      </AdminDialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Inline stock editor: −/+ save immediately, typed value saves on Enter/blur
// ---------------------------------------------------------------------------
function StockEditor({
  qty,
  state,
  onCommit,
}: {
  qty: number;
  state: "out" | "low" | "ok";
  onCommit: (qty: number) => void;
}) {
  // The parent keys this component by qty, so a saved/rolled-back qty remounts it with a fresh draft
  const [draft, setDraft] = useState(String(qty));

  const commitDraft = () => {
    const n = parseInt(draft, 10);
    if (Number.isNaN(n) || n < 0) {
      setDraft(String(qty));
      return;
    }
    onCommit(n);
  };

  return (
    <div className={`stock-editor ${state}`}>
      <button type="button" aria-label="Үлдэгдэл хасах" disabled={qty <= 0} onClick={() => onCommit(qty - 1)}>
        <Minus size={12} />
      </button>
      <input
        type="number"
        min={0}
        value={draft}
        aria-label="Үлдэгдэл"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") { setDraft(String(qty)); (e.target as HTMLInputElement).blur(); }
        }}
      />
      <button type="button" aria-label="Үлдэгдэл нэмэх" onClick={() => onCommit(qty + 1)}>
        <Plus size={12} />
      </button>
      {state !== "ok" && <span className="stock-label">{state === "out" ? "Дууссан" : "Цөөн"}</span>}

      <style jsx>{`
        .stock-editor {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .stock-editor button {
          width: 26px;
          height: 26px;
          border: 1px solid var(--admin-border);
          background: transparent;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--admin-text-secondary, var(--admin-muted));
        }
        .stock-editor button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .stock-editor input {
          width: 52px;
          height: 26px;
          padding: 0 4px;
          text-align: center;
          border: 1px solid var(--admin-border);
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          background: transparent;
          color: inherit;
          -moz-appearance: textfield;
        }
        .stock-editor input::-webkit-outer-spin-button,
        .stock-editor input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .stock-editor.out input { border-color: var(--admin-danger); color: var(--admin-danger); }
        .stock-editor.low input { border-color: var(--admin-warning); color: #b45309; }
        .stock-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .stock-editor.out .stock-label { color: var(--admin-danger); }
        .stock-editor.low .stock-label { color: #b45309; }
      `}</style>
    </div>
  );
}
