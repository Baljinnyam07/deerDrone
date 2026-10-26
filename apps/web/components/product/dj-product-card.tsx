import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@deer-drone/types";
import { formatPrice } from "../../lib/showcase";

export function DjProductCard({ product }: { product: Product }) {
  const image = (product.images.find((img) => img.isThumbnail) ?? product.images[0])?.url;
  const onSale = !!product.comparePrice && product.comparePrice > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="dj-pcard">
      <div className="dj-pcard-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image || "/assets/drone-product.png"} alt={product.name} className="dj-cutout" loading="lazy" />
      </div>
      <div className="dj-pcard-body">
        <span className="dj-pcard-tag">{onSale ? "Хямдралтай" : product.isLeasable ? "Лизингээр авах боломжтой" : ""}</span>
        <h3 className="dj-pcard-name">{product.name.trim()}</h3>
        <div className="dj-pcard-price">
          {formatPrice(product.price)}
          {onSale && <s>{formatPrice(product.comparePrice!)}</s>}
        </div>
        <span className="dj-pcard-cta">
          Худалдаж авах <ChevronRight size={14} />
        </span>
      </div>
    </Link>
  );
}
