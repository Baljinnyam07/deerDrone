import { createAdminClient } from "../../lib/supabase";
import { formatMoney } from "@deer-drone/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getProducts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name, slug),
      images:product_images(url, alt, display_order)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products fetch error:", error);
    return [];
  }
  return data || [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Products</p>
        <h1>Бүтээгдэхүүний удирдлага</h1>
        <p className="admin-muted">
          Supabase-аас бодит каталог. Нийт: {products.length} бүтээгдэхүүн.
        </p>
      </div>

      <article className="admin-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Бүх бүтээгдэхүүн</h2>
          <Link
            href="/products/new"
            className="admin-primary-btn"
          >
            <Plus size={16} />
            <span>Шинэ нэмэх</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="admin-muted" style={{ padding: "1rem" }}>Бүтээгдэхүүн байхгүй.</p>
        ) : (
          <div className="table-like">
            {products.map((product: any) => {
              const firstImage = product.images
                ?.sort((a: any, b: any) => a.display_order - b.display_order)?.[0];
              return (
                <Link href={`/products/${product.id}/edit`} style={{ textDecoration: "none", color: "inherit", display: "block" }} key={product.id}>
                  <div className="table-row" style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {firstImage ? (
                        <img
                          src={firstImage.url}
                          alt={firstImage.alt || product.name}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            background: "#f8f9fa",
                          }}
                        />
                      ) : (
                        <div style={{ width: 48, height: 48, background: "#f8f9fa", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                          📦
                        </div>
                      )}
                      <div>
                        <strong>{product.name}</strong>
                        <p className="admin-muted" style={{ fontSize: "0.75rem", margin: "2px 0 0" }}>{product.sku || product.slug}</p>
                      </div>
                    </div>
                    <div>{product.category?.name || "—"}</div>
                    <div>
                      <strong>{formatMoney(Number(product.price))}</strong>
                      {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                        <p className="admin-muted" style={{ textDecoration: "line-through", fontSize: "0.75rem", margin: "2px 0 0" }}>
                          {formatMoney(Number(product.compare_price))}
                        </p>
                      )}
                    </div>
                    <div>
                      <span
                        className="status-pill"
                        style={{
                          backgroundColor: product.stock_qty > 5 ? "#10b981" : product.stock_qty > 0 ? "#f59e0b" : "#ef4444",
                          color: "#fff",
                        }}
                      >
                        {product.stock_qty} ш
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </article>
    </section>
  );
}
