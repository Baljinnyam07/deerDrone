import { createAdminClient } from "../../lib/supabase";
import { ProductsClient } from "./products-client";
import { AdminPageHeader } from "@/components/admin-page-header";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProducts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name, slug),
      images:product_images(url, alt, display_order),
      specs:product_specs(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products fetch error:", error);
    return [];
  }
  return data || [];
}

async function getCategories() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Categories fetch error:", error);
    return [];
  }

  return data || [];
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <section>
      <AdminPageHeader
        kicker="Catalog / Бүтээгдэхүүн"
        title="Бараа бүтээгдэхүүн"
        description="Бүтээгдэхүүний каталог удирдах, үнэ болон үлдэгдэл шинэчлэх."
      />

      <ProductsClient initialProducts={products} categories={categories} />
    </section>
  );
}
