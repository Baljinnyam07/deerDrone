"use server";

import { createPublicClient } from "./supabase/server";

export type SearchResult = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  categoryName: string;
  imageUrl: string | null;
};

export async function searchProducts(q: string): Promise<SearchResult[]> {
  if (q.length < 2) return [];

  const supabase = await createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, slug, name, short_description,
      category:categories(name),
      images:product_images(url, display_order)
    `)
    .ilike("name", `%${q}%`)
    .limit(8);

  if (error || !data) return [];

  return (data as any[]).map((row) => {
    const imgs: { url: string; display_order?: number }[] = row.images ?? [];
    imgs.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      shortDescription: row.short_description ?? "",
      categoryName: row.category?.name ?? "",
      imageUrl: imgs[0]?.url ?? null,
    };
  });
}
