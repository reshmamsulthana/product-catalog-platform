import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatPrice } from "../utils/format-price";

type Props = {
  product: Product;
  style?: CSSProperties;
};

export function ProductCard({ product, style }: Props) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="product-card"
      style={style}
    >
      <div className="product-card__image">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__meta">
          <span>{formatPrice(product.price)}</span>
          <span>★ {product.rating.rate}</span>
        </div>
      </div>
    </Link>
  );
}
