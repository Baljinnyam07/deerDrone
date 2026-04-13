import { createAdminClient } from "../../lib/supabase";
import { ProductsClient } from "./products-client";
import { AdminPageHeader } from "@/components/admin-page-header";

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
      <AdminPageHeader
        kicker="Catalog / Бүтээгдэхүүн"
        title="Бараа бүтээгдэхүүн"
        description="Бүтээгдэхүүний каталог удирдах, үнэ болон үлдэгдэл шинэчлэх."
      />

      <ProductsClient initialProducts={products} />
    </section>
  );
}
