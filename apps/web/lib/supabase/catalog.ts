import "server-only";

import type { Product } from "@deer-drone/types";
import { createServiceClient } from "./service";

type ProductRecord = {
  id: string;
  sku?: string | null;
  slug: string;
  name: string;
  brand?: string | null;
  category_id?: string | null;
  price: number;
  compare_price?: number | null;
  currency?: Product["currency"] | null;
  short_description?: string | null;
  description?: string | null;
  stock_qty?: number | null;
  hero_note?: string | null;
  is_leasable?: boolean | null;
  is_featured?: boolean | null;
  status?: Product["status"] | null;
  tags?: string[] | null;
  category?: {
    name?: string | null;
    slug?: string | null;
  } | null;
  images?: Array<{
    alt?: string | null;
    display_order?: number | null;
    url: string;
  }> | null;
  specs?: Array<{
    display_order?: number | null;
    label: string;
    value: string;
  }> | null;
};

function normalizeText(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

export function mapProductRecord(item: ProductRecord): Product {
  return {
    id: item.id,
    sku: item.sku || "",
    slug: item.slug,
    name: item.name,
    brand: item.brand || "DEER",
    categoryId: item.category_id || undefined,
    price: item.price,
    comparePrice: item.compare_price ?? undefined,
    currency: item.currency || "MNT",
    shortDescription: item.short_description || "",
    description: item.description || "",
    stockQty: item.stock_qty ?? 0,
    categoryName: item.category?.name || "",
    categorySlug: item.category?.slug || "",
    heroNote: item.hero_note || "",
    isLeasable: !!item.is_leasable,
    isFeatured: !!item.is_featured,
    status: item.status || "active",
    tags: item.tags || [],
    images:
      item.images
        ?.sort((left, right) => (left.display_order ?? 0) - (right.display_order ?? 0))
        .map((image) => ({
          url: image.url,
          alt: image.alt || item.name,
        })) || [],
    specs:
      item.specs
        ?.sort((left, right) => (left.display_order ?? 0) - (right.display_order ?? 0))
        .map((spec) => ({
          group: "",
          label: spec.label,
          value: spec.value,
        })) || [],
  };
}

export function matchesCatalogQuery(product: Product, query?: string): boolean {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return true;
  }

  const haystack = [
    product.name,
    product.brand,
    product.shortDescription,
    product.description,
    product.categoryName,
    product.categorySlug,
    product.heroNote,
    ...product.tags,
  ]
    .map((value) => normalizeText(value))
    .join(" ");

  return haystack.includes(normalizedQuery);
}

export async function getCatalogProducts(options?: {
  category?: string;
  featuredOnly?: boolean;
  limit?: number;
  query?: string;
}): Promise<Product[]> {
  const supabase = createServiceClient();
  const normalizedCategory = normalizeText(options?.category);

  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      specs:product_specs(*)
    `)
    .order("created_at", { ascending: false });

  if (normalizedCategory) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", normalizedCategory)
      .maybeSingle();

    if (category?.id) {
      query = query.eq("category_id", category.id);
    }
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Error loading catalog products:", error);
    return [];
  }

  let products = data
    .map((item) => mapProductRecord(item as ProductRecord))
    .sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured));

  if (options?.featuredOnly) {
    const featuredProducts = products.filter((product) => product.isFeatured);
    products = featuredProducts.length > 0 ? featuredProducts : products;
  }

  if (options?.query) {
    products = products.filter((product) =>
      matchesCatalogQuery(product, options.query),
    );
  }

  if (options?.limit) {
    products = products.slice(0, options.limit);
  }

  return products;
}
