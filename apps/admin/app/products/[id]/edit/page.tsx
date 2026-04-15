import { createAdminClient } from "../../../../lib/supabase";
import { EditProductForm } from "./edit-product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const supabase = createAdminClient();
  
  const [catRes, prodRes] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("products")
      .select("*, images:product_images(url, display_order), specs:product_specs(label, value, display_order)")
      .eq("id", id)
      .single()
  ]);

  if (prodRes.error || !prodRes.data) {
    return notFound();
  }

  return (
    <section>
      <div className="admin-title">
        <p className="admin-kicker">Products</p>
        <h1>Бүтээгдэхүүн засах</h1>
        <p className="admin-muted">
          Сонгосон барааны мэдээллийг өөрчлөх
        </p>
      </div>

      <article className="admin-panel">
        <EditProductForm categories={catRes.data || []} initialProduct={prodRes.data} />
      </article>
    </section>
  );
}
