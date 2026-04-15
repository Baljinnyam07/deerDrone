"use client";

import { useState } from "react";
import { safeMoney } from "../../lib/format";
import { AdminDrawer } from "../../components/ui/admin-drawer";
import { AdminDialog } from "../../components/ui/admin-dialog";
import { StatusBadge } from "../../components/ui/status-badge";
import { ActionMenu } from "../../components/ui/action-menu";
import { AdminButton } from "../../components/ui/admin-button";
import { useToast } from "../../components/ui/toast";
import { ImageUploader } from "../../components/ui/image-uploader";
import { Plus, Edit2, Trash2, Eye, Camera, Package, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProductsClientProps {
  initialProducts: any[];
  categories: Array<{ id: string; name: string }>;
}

export function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_qty: "0",
    category_id: "",
    sku: "",
    description: "",
    brand: "",
    short_description: "",
    slug: "",
  });
  const [images, setImages] = useState<any[]>([]);
  const [specs, setSpecs] = useState<any[]>([]);

  const handleOpenNew = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      price: "",
      stock_qty: "0",
      category_id: "",
      sku: "",
      description: "",
      brand: "",
      short_description: "",
      slug: "",
    });
    setImages([]);
    setSpecs([]);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock_qty: product.stock_qty.toString(),
      category_id: product.category_id || "",
      sku: product.sku || "",
      description: product.description || "",
      brand: product.brand || "",
      short_description: product.short_description || "",
      slug: product.slug || "",
    });
    setImages(product.images || []);
    setSpecs(product.specs || []);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = selectedProduct ? `/api/products/${selectedProduct.id}` : "/api/products/create";
      const method = selectedProduct ? "PATCH" : "POST";
      
      const payload = {
        product: {
          ...formData,
          price: parseFloat(formData.price),
          stock_qty: parseInt(formData.stock_qty),
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

  return (
    <>
      <article className="admin-panel">
        {/* Header with Action */}
        <div className="admin-panel-header" style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: 0 }}>Бүх бүтээгдэхүүн</h2>
          <AdminButton icon={Plus} onClick={handleOpenNew} size="md">Шинэ нэмэх</AdminButton>
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

          {/* Product Rows */}
          {initialProducts.map((product) => {
            const firstImage = product.images?.sort((a: any, b: any) => a.display_order - b.display_order)?.[0];
            return (
              <div 
                key={product.id} 
                className="admin-table-row cols-5-products" 
                onClick={() => handleOpenEdit(product)}
              >
                {/* Product with Image & Name */}
                <div className="admin-table-cell-meta" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className="admin-table-thumbnail">
                    {firstImage ? (
                      <img src={firstImage.url} alt={product.name} />
                    ) : (
                      <Package size={18} className="admin-table-thumbnail-icon" />
                    )}
                  </div>
                  <div>
                    <div className="admin-table-cell-primary">{product.name}</div>
                    <div className="admin-table-cell-secondary">{product.sku || product.slug}</div>
                  </div>
                </div>

                {/* Category */}
                <div className="text-sm">{product.category?.name || "—"}</div>

                {/* Price */}
                <div className="font-semibold">{safeMoney(product.price)}</div>

                {/* Stock Status */}
                <div>
                  <StatusBadge variant={product.stock_qty > 5 ? "success" : product.stock_qty > 0 ? "warning" : "danger"}>
                    {product.stock_qty} ш
                  </StatusBadge>
                </div>

                {/* Actions */}
                <div className="admin-table-actions" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu
                    items={[
                      { label: "Засах", icon: Edit2, onClick: () => handleOpenEdit(product) },
                      { label: "Устгах", icon: Trash2, onClick: () => handleDeleteClick(product), variant: "danger" },
                    ]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </article>

      {/* Product Drawer (Form) */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedProduct ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн нэмэх"}
        description={selectedProduct ? `${selectedProduct.name} бүтээгдэхүүний мэдээллийг шинэчлэх.` : "Каталогт шинээр бараа бүртгэх."}
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
            <h3 className="form-section-title">Бүтээгдэхүүний зураг</h3>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          <div className="form-divider" />

          {/* Basic Info */}
          <div className="form-section">
            <h3 className="form-section-title">Үндсэн мэдээлэл</h3>
            <div className="form-group">
              <label>Нэр</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                  setFormData({...formData, name, slug});
                }}
                required
                className="admin-input"
                placeholder="Бүтээгдэхүүний нэр..."
              />
            </div>

            <div className="form-group">
              <label>Slug (URL зам)</label>
              <input 
                type="text" 
                value={formData.slug} 
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                required
                className="admin-input"
                placeholder="product-name-slug"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Үнэ (₮)</label>
                <input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className="admin-input"
                />
              </div>
              <div className="form-group">
                <label>Үлдэгдэл</label>
                <input 
                  type="number" 
                  value={formData.stock_qty} 
                  onChange={(e) => setFormData({...formData, stock_qty: e.target.value})}
                  required
                  className="admin-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>SKU (Модель)</label>
              <input 
                type="text" 
                value={formData.sku} 
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="admin-input"
                placeholder="Бүтээгдэхүүний код..."
              />
            </div>

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
          </div>

          <div className="form-divider" />

          {/* Details */}
          <div className="form-section">
            <h3 className="form-section-title">Дэлгэрэнгүй мэдээлэл</h3>
            <div className="form-group">
              <label>Богино тайлбар (Kicker)</label>
              <input 
                type="text" 
                value={formData.short_description} 
                onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                className="admin-input"
                placeholder="Жишээ: Шинэ загвар, Хурдан хүргэлт..."
              />
            </div>
            <div className="form-group">
              <label>Дэлгэрэнгүй тайлбар</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="admin-input"
                style={{ minHeight: "120px" }}
                placeholder="Барааны дэлгэрэнгүй мэдээлэл..."
              />
            </div>
          </div>

          <div className="form-divider" />

          {/* Specifications */}
          <div className="form-section">
            <h3 className="form-section-title">
              <Info size={14} />
              Бүтээгдэхүүний үзүүлэлтүүд
            </h3>

            <div className="spec-list">
              {specs.length === 0 ? (
                <p className="spec-empty">Одоогоор үзүүлэлт оруулаагүй байна.</p>
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
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--admin-muted);
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
            color: var(--admin-fg);
            border-radius: 8px;
            padding: 8px 12px;
            font-weight: 600;
            cursor: pointer;
            width: fit-content;
          }
          .spec-remove-btn {
            width: 36px;
            height: 36px;
            border: 1px solid #fecaca;
            color: #dc2626;
            background: #fff;
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
