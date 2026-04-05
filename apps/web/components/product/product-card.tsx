import Link from "next/link";
import type { Product } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="dji-product-card">
      <Link href={`/products/${product.slug}`} className="dji-card-link">
        <div className="dji-card-content">
          {/* Eyebrow */}
          <span className="dji-card-eyebrow">
            {product.categoryName || 'Featured Product'}
          </span>
          
          {/* Title */}
          <h3 className="dji-card-title">{product.name}</h3>
          
          {/* Subtitle / Price */}
          <span className="dji-card-subtitle">
            {product.shortDescription || formatMoney(product.price)}
          </span>
          
          {/* CTA Links */}
          <div className="dji-card-actions">
            <span className="dji-text-link">Learn More &gt;</span>
            <span className="dji-text-link">Buy Now &gt;</span>
          </div>
        </div>
        
        <div className="dji-card-image">
          <img alt={product.images[0]?.alt ?? product.name} src={product.images[0]?.url} className="dji-img-el" />
        </div>
      </Link>
    </article>
  );
}
