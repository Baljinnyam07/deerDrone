import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin-page-header";
import { sanitizeProductMedia, type ProductMedia } from "@/lib/product-media";
import { MediaEditor } from "./media-editor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const EMPTY_MEDIA: ProductMedia = {
  folder: "",
  hero: { id: "", alt: "" },
  chapters: [],
  galleryTitle: "",
  gallery: [],
};

/** Built-in configuration from the storefront, the starting point for products that were never edited. */
async function getBuiltinMedia(siteUrl: string, slug: string): Promise<ProductMedia | null> {
  try {
    const res = await fetch(`${siteUrl}/api/v1/product-media/${encodeURIComponent(slug)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const { media } = await res.json();
    return media ? (media as ProductMedia) : null;
  } catch {
    return null;
  }
}

export default async function ProductMediaPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, name, slug")
    .eq("id", id)
    .single();

  if (!product) return notFound();

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://www.deerdrone.mn").replace(/\/$/, "");

  const { data: saved } = await supabase
    .from("product_media")
    .select("data")
    .eq("slug", product.slug)
    .maybeSingle();

  const custom = saved ? sanitizeProductMedia(saved.data) : null;
  const builtin = custom ? null : await getBuiltinMedia(siteUrl, product.slug);

  return (
    <section>
      <Link href="/products" className="admin-back-link">
        <ArrowLeft size={16} /> Бүтээгдэхүүн рүү буцах
      </Link>
      <AdminPageHeader
        kicker="Catalog / Дэлгэрэнгүй хуудас"
        title={product.name}
        description="Бүтээгдэхүүний дэлгэрэнгүй хуудасны гарчиг, текст, зураг, видеог эндээс засна."
      />
      <MediaEditor
        slug={product.slug}
        siteUrl={siteUrl}
        initial={custom ?? builtin ?? EMPTY_MEDIA}
        source={custom ? "custom" : builtin ? "builtin" : "empty"}
      />
    </section>
  );
}
