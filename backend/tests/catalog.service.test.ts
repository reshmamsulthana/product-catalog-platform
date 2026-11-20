import { describe, expect, it } from "vitest";
import type { ProductSource } from "../src/ports/product-source.js";
import {
  CatalogService,
  sortByRating,
} from "../src/services/catalog.service.js";
import type { Product } from "../src/types/product.js";

function product(
  overrides: Partial<Product> & Pick<Product, "id" | "title">,
): Product {
  return {
    price: 10,
    description: "A product description",
    category: "electronics",
    image: "https://example.com/img.png",
    rating: { rate: 3, count: 10 },
    ...overrides,
  };
}

const sample: Product[] = [
  product({ id: 1, title: "Alpha Phone", rating: { rate: 4.5, count: 100 } }),
  product({ id: 2, title: "Beta Cable", rating: { rate: 4.8, count: 50 } }),
  product({ id: 3, title: "Gamma Case", rating: { rate: 4.8, count: 200 } }),
  product({ id: 4, title: "Delta Ring", category: "jewelery", rating: { rate: 3.2, count: 20 } }),
  product({ id: 5, title: "Epsilon Hat", rating: { rate: 4.9, count: 10 } }),
  product({ id: 6, title: "Zeta Shirt", rating: { rate: 2.1, count: 5 } }),
];

class FakeSource implements ProductSource {
  constructor(private products: Product[]) {}

  async getAll() {
    return this.products;
  }

  async getById(id: number) {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async getCategories() {
    return [...new Set(this.products.map((p) => p.category))];
  }

  async getByCategory(category: string) {
    return this.products.filter((p) => p.category === category);
  }
}

describe("sortByRating", () => {
  it("orders by rate, then count, then id", () => {
    const ranked = sortByRating(sample);
    expect(ranked.map((p) => p.id)).toEqual([5, 3, 2, 1, 4, 6]);
  });
});

describe("CatalogService", () => {
  const catalog = new CatalogService(new FakeSource(sample));

  it("returns top 5 featured products", async () => {
    const featured = await catalog.getFeatured();
    expect(featured).toHaveLength(5);
    expect(featured.map((p) => p.id)).toEqual([5, 3, 2, 1, 4]);
  });

  it("splits category into topRated and others", async () => {
    const many = [
      product({ id: 10, title: "A", category: "electronics", rating: { rate: 5, count: 1 } }),
      product({ id: 11, title: "B", category: "electronics", rating: { rate: 4, count: 1 } }),
      product({ id: 12, title: "C", category: "electronics", rating: { rate: 3, count: 1 } }),
      product({ id: 13, title: "D", category: "electronics", rating: { rate: 2, count: 1 } }),
      product({ id: 14, title: "E", category: "electronics", rating: { rate: 1, count: 1 } }),
    ];
    const service = new CatalogService(new FakeSource(many));
    const result = await service.getCategoryProducts("electronics");
    expect(result.topRated.map((p) => p.id)).toEqual([10, 11, 12]);
    expect(result.others.map((p) => p.id)).toEqual([13, 14]);
  });

  it("searches title and description case-insensitively", async () => {
    const withDesc = [
      product({ id: 1, title: "Winter Coat", description: "Warm wool layer" }),
      product({ id: 2, title: "Summer Hat", description: "Light cotton" }),
    ];
    const service = new CatalogService(new FakeSource(withDesc));
    expect((await service.search("wool")).map((p) => p.id)).toEqual([1]);
    expect((await service.search("HAT")).map((p) => p.id)).toEqual([2]);
    expect(await service.search("   ")).toEqual([]);
  });
});