import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getSimilarProducts } from "../../../../../lib/supabase/queries";
import ClassicProductView from "../ClassicProductView";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    alternates: { canonical: `/products/${slug}` },
    robots: { index: false },
  };
}

export default async function ProductBuyPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const similarProducts = await getSimilarProducts(product.categoryId!, product.id!);
  return <ClassicProductView product={product as any} similarProducts={similarProducts} />;
}
