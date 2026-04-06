import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/server-env";
import { getCatalogProducts } from "../lib/supabase/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const products = await getCatalogProducts();
  const now = new Date();

  return [
    {
      lastModified: now,
      url: siteUrl,
    },
    {
      lastModified: now,
      url: `${siteUrl}/products`,
    },
    {
      lastModified: now,
      url: `${siteUrl}/cart`,
    },
    {
      lastModified: now,
      url: `${siteUrl}/checkout`,
    },
    ...products.map((product) => ({
      lastModified: now,
      url: `${siteUrl}/products/${product.slug}`,
    })),
  ];
}
