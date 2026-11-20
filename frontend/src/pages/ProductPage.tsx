import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { EnquiryForm } from "../components/EnquiryForm";
import type { Product } from "../types";
import { formatPrice } from "../utils/format-price";

export function ProductPage() {
  const { id = "" } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isInteger(productId) || productId <= 0) {
      setError("Invalid product id");
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .getProduct(productId)
      .then(setProduct)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <p className="status">Loading product…</p>;
  if (error) return <p className="status error">{error}</p>;
  if (!product) return <p className="status">Product not found.</p>;

  return (
    <section className="product-detail">
      <div className="product-detail__image">
        <img src={product.image} alt={product.title} />
      </div>
      <div>
        <Link
          className="badge"
          to={`/category/${encodeURIComponent(product.category)}`}
        >
          {product.category}
        </Link>
        <h1>{product.title}</h1>
        <p className="price">{formatPrice(product.price)}</p>
        <p>
          ★ {product.rating.rate} · {product.rating.count} reviews
        </p>
        <p>{product.description}</p>
        <EnquiryForm product={product} />
      </div>
    </section>
  );
}