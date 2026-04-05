import { createClient } from "./server";
import type { Product } from "@deer-drone/types";

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      specs:product_specs(*)
    `)
    .order("created_at", { ascending: false });

  if (categorySlug) {
    // First find the category to filter by
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (cat?.id) {
      query = query.eq("category_id", cat.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  // Map the database structure back into the UI Product type
  return data.map((item: any) => ({
    id: item.id,
    sku: item.sku || "",
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    price: item.price,
    comparePrice: item.compare_price,
    currency: (item.currency as any) || "MNT",
    shortDescription: item.short_description,
    description: item.description,
    stockQty: item.stock_qty,
    categoryName: item.category?.name || "",
    categorySlug: item.category?.slug || "",
    heroNote: item.hero_note || "",
    isLeasable: !!item.is_leasable,
    isFeatured: !!item.is_featured,
    status: (item.status as any) || "active",
    tags: item.tags || [],
    images: item.images?.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => ({
      url: img.url,
      alt: img.alt,
    })) || [],
    specs: item.specs?.sort((a: any, b: any) => a.display_order - b.display_order).map((spec: any) => ({
      label: spec.label,
      value: spec.value,
    })) || [],
  }));
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      specs:product_specs(*)
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    sku: data.sku || "",
    slug: data.slug,
    name: data.name,
    brand: data.brand,
    price: data.price,
    comparePrice: data.compare_price,
    currency: (data.currency as any) || "MNT",
    shortDescription: data.short_description,
    description: data.description,
    stockQty: data.stock_qty,
    categoryName: data.category?.name || "",
    categorySlug: data.category?.slug || "",
    heroNote: data.hero_note || "",
    isLeasable: !!data.is_leasable,
    isFeatured: !!data.is_featured,
    status: (data.status as any) || "active",
    tags: data.tags || [],
    images: data.images?.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => ({
      url: img.url,
      alt: img.alt,
    })) || [],
    specs: data.specs?.sort((a: any, b: any) => a.display_order - b.display_order).map((spec: any) => ({
      label: spec.label,
      value: spec.value,
    })) || [],
  };
}
