import { notFound } from "next/navigation";
import { getProductBySlug } from "../../../../lib/supabase/queries";
import ProductDetailView from "./ProductDetailView";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product as any} />;
}
