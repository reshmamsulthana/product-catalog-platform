import { useEffect, useState } from "react";
import { api } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getFeatured()
      .then(setProducts)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="hero">
        <h1>Top rated picks</h1>
        <p>Five highest-rated products from the catalogue.</p>
      </div>

      {loading ? <p className="status">Loading featured products…</p> : null}
      {error ? <p className="status error">{error}</p> : null}

      <div className="grid">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            style={{ animationDelay: `${index * 40}ms` }}
          />
        ))}
      </div>
    </section>
  );
}