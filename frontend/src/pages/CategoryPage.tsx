import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { ProductCard } from "../components/ProductCard";
import type { CategoryProducts } from "../types";

export function CategoryPage() {
  const { name = "" } = useParams();
  const category = decodeURIComponent(name);
  const [data, setData] = useState<CategoryProducts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getCategory(category)
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <section>
      <div className="hero">
        <h1 style={{ textTransform: "capitalize" }}>{category}</h1>
        <p>Top rated items first, then the rest of the category.</p>
      </div>

      {loading ? <p className="status">Loading category…</p> : null}
      {error ? <p className="status error">{error}</p> : null}

      {data ? (
        <>
          <h2 className="section-title">Top rated</h2>
          <div className="grid">
            {data.topRated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {data.others.length > 0 ? (
            <>
              <h2 className="section-title">More in this category</h2>
              <div className="grid">
                {data.others.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </section>
  );
}