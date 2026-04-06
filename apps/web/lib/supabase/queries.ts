import { createClient } from "./server";
import type { Product } from "@deer-drone/types";
import { mapProductRecord } from "./catalog";

export async function getProducts(options: {
  categorySlug?: string;
  brand?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
} = {}): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      specs:product_specs(*)
    `);

  if (options.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();

    if (cat?.id) {
      query = query.eq("category_id", cat.id);
    }
  }

  if (options.brand) {
    query = query.eq("brand", options.brand);
  }

  if (options.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  // Sorting
  switch (options.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data.map((item: any) => mapProductRecord(item));
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

export async function getBrands() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("brand")
    .not("brand", "is", null);

  if (error) return [];

  const brands = Array.from(new Set(data.map(p => p.brand))).filter(Boolean) as string[];
  return brands.sort();
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

  return mapProductRecord(data as any);
}

export async function getSimilarProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      specs:product_specs(*)
    `)
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .limit(8);

  if (error || !data) {
    return [];
  }

  return data.map((item: any) => mapProductRecord(item));
}
