import type { ProductSource } from "../ports/product-source.js";
import type { Product } from "../types/product.js";

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

const CACHE_TTL_MS = 60_000;

export class FakeStoreProductSource implements ProductSource {
  private cache: { products: Product[]; expiresAt: number } | null = null;

  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<Product[]> {
    return this.fetchProducts();
  }

  async getById(id: number): Promise<Product | null> {
    const products = await this.fetchProducts();
    return products.find((p) => p.id === id) ?? null;
  }

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/products/categories`);
    if (!response.ok) {
      throw new UpstreamError(
        `Fake Store categories failed: ${response.status}`,
      );
    }
    return (await response.json()) as string[];
  }

  async getByCategory(category: string): Promise<Product[]> {
    const encoded = encodeURIComponent(category);
    const response = await fetch(
      `${this.baseUrl}/products/category/${encoded}`,
    );
    if (!response.ok) {
      throw new UpstreamError(
        `Fake Store category failed: ${response.status}`,
      );
    }
    const data = (await response.json()) as FakeStoreProduct[];
    return data.map(mapProduct);
  }

  private async fetchProducts(): Promise<Product[]> {
    const now = Date.now();
    if (this.cache && this.cache.expiresAt > now) {
      return this.cache.products;
    }

    const response = await fetch(`${this.baseUrl}/products`);
    if (!response.ok) {
      throw new UpstreamError(`Fake Store products failed: ${response.status}`);
    }

    const data = (await response.json()) as FakeStoreProduct[];
    const products = data.map(mapProduct);
    this.cache = { products, expiresAt: now + CACHE_TTL_MS };
    return products;
  }
}

function mapProduct(raw: FakeStoreProduct): Product {
  return {
    id: raw.id,
    title: raw.title,
    price: raw.price,
    description: raw.description,
    category: raw.category,
    image: raw.image,
    rating: {
      rate: raw.rating?.rate ?? 0,
      count: raw.rating?.count ?? 0,
    },
  };
}

export class UpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpstreamError";
  }
}