import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@deer-drone/types";
import { formatPrice } from "../../lib/showcase";

export function DjProductCard({ product }: { product: Product }) {
  const image = (product.images.find((img) => img.isThumbnail) ?? product.images[0])?.url;
  const onSale = !!product.comparePrice && product.comparePrice > product.price;
  const discount = onSale ? Math.round((1 - product.price / product.comparePrice!) * 100) : 0;
  const soldOut = product.stockQty <= 0;

  return (
    <Link href={`/products/${product.slug}`} className={`dj-pcard${soldOut ? " is-soldout" : ""}`}>
      <div className="dj-pcard-media">
        <div className="dj-pcard-badges">
          {soldOut ? (
            <span className="dj-pcard-badge is-soldout">Дууссан</span>
          ) : (
            onSale && <span className="dj-pcard-badge is-sale">-{discount}%</span>
          )}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image || "/assets/drone-product.png"} alt={product.name} className="dj-cutout" loading="lazy" />
      </div>
      <div className="dj-pcard-body">
        <h3 className="dj-pcard-name">{product.name.trim()}</h3>
        <div className="dj-pcard-foot">
          <div className="dj-pcard-price">
            <strong>{formatPrice(product.price)}</strong>
            {onSale && <s>{formatPrice(product.comparePrice!)}</s>}
          </div>
          <span className="dj-pcard-cta" aria-hidden="true">
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
