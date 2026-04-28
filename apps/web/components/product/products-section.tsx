import { getProducts } from "../../lib/supabase/queries";
import { ProductsGrid } from "./products-grid";
import { PAGE_SIZE, type SortOption } from "../../lib/products-config";

interface ProductsSectionProps {
  categorySlug?: string;
  brand?: string;
  search?: string;
  sort?: SortOption;
}

export async function ProductsSection({
  categorySlug,
  brand,
  search,
  sort,
}: ProductsSectionProps) {
  const products = await getProducts({
    categorySlug,
    brand,
    search,
    sort,
    limit: PAGE_SIZE,
    offset: 0,
  });

  return (
    <ProductsGrid
      initialProducts={products}
      categorySlug={categorySlug}
      brand={brand}
      search={search}
      sort={sort}
    />
  );
}
