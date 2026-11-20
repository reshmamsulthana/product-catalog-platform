import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import type { Product } from "../types";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .search(q)
      .then(setProducts)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Search failed"),
      )
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <section>
      <div className="hero">
        <h1>Search</h1>
        <p>
          {q
            ? `Results for “${q}”`
            : "Enter a term and click Search."}
        </p>
        <SearchBar initialQuery={q} />
      </div>

      {loading ? <p className="status">Searching…</p> : null}
      {error ? <p className="status error">{error}</p> : null}

      {!loading && !error && q && products.length === 0 ? (
        <p className="status">No products matched that search.</p>
      ) : null}

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}