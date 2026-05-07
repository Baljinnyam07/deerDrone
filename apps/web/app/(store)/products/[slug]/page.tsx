import { notFound } from "next/navigation";
import { getProductBySlug, getSimilarProducts } from "../../../../lib/supabase/queries";
import ProductDetailView from "./ProductDetailView";
import type { Metadata } from "next";
import { getSiteUrl } from "../../../../lib/server-env";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  const siteUrl = getSiteUrl();
  const imageUrl = product.images?.[0]?.url || `${siteUrl}/assets/brand/og-image.png`;

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: `${product.name} | DEER Drone Shop`,
      description: product.shortDescription,
      url: `${siteUrl}/products/${slug}`,
      images: [{ url: imageUrl, alt: product.name }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const similarProducts = await getSimilarProducts(product.categoryId!, product.id!);

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map(img => img.url) || [],
    "description": product.shortDescription || product.description,
    "sku": product.slug,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "DJI"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/products/${slug}`,
      "priceCurrency": "MNT",
      "price": product.price,
      "availability": product.stockQty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView product={product as any} similarProducts={similarProducts} />
    </>
  );
}
