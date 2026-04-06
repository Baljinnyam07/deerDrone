import { notFound } from "next/navigation";
import { getProductBySlug, getSimilarProducts } from "../../../../lib/supabase/queries";
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

  const similarProducts = await getSimilarProducts(product.categoryId!, product.id!);

  return <ProductDetailView product={product as any} similarProducts={similarProducts} />;
}
