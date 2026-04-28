import { createPublicClient } from "./server";
import { unstable_cache } from "next/cache";
import type { Product } from "@deer-drone/types";
import { mapProductRecord } from "./catalog";
import type { SortOption } from "../products-config";

export const getProducts = unstable_cache(
  async (options: {
    categorySlug?: string;
    brand?: string;
    search?: string;
    sort?: SortOption;
    limit?: number;
    offset?: number;
  } = {}): Promise<Product[]> => {
    const supabase = await createPublicClient();

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

    if (options.limit !== undefined) {
      const from = options.offset ?? 0;
      query = query.range(from, from + options.limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data.map((item: any) => mapProductRecord(item));
  },
  ["products-query"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCategories = unstable_cache(
  async () => {
    const supabase = await createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data;
  },
  ["categories-query"],
  { revalidate: 3600, tags: ["categories"] }
);

export const getBrands = unstable_cache(
  async () => {
    const supabase = await createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("brand")
      .not("brand", "is", null);

    if (error) return [];

    const brands = Array.from(new Set(data.map(p => p.brand))).filter(Boolean) as string[];
    return brands.sort();
  },
  ["brands-query"],
  { revalidate: 3600, tags: ["brands"] }
);

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = await createPublicClient();

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
  },
  ["product-by-slug"],
  { revalidate: 3600, tags: ["products"] }
);

export const getSimilarProducts = unstable_cache(
  async (categoryId: string, currentProductId: string): Promise<Product[]> => {
    const supabase = await createPublicClient();

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
  },
  ["similar-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getSiteSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const supabase = await createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error || !data) {
      return {};
    }

    return data.reduce((acc, curr) => {
      if (curr.value) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  },
  ["site-settings"],
  { revalidate: 3600, tags: ["settings"] }
);
