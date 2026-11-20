import type { ProductSource } from "../ports/product-source.js";
import type { CategoryProducts, Product } from "../types/product.js";

const FEATURED_COUNT = 5;
const CATEGORY_TOP_RATED_COUNT = 3;

export class CatalogService {
  constructor(private readonly productSource: ProductSource) {}

  async getFeatured(): Promise<Product[]> {
    // Acceptance: home shows 5 top-rated products
    const products = await this.productSource.getAll();
    return sortByRating(products).slice(0, FEATURED_COUNT);
  }

  async getCategories(): Promise<string[]> {
    return this.productSource.getCategories();
  }

  async getCategoryProducts(category: string): Promise<CategoryProducts> {
    const products = await this.productSource.getByCategory(category);
    const ranked = sortByRating(products);
    return {
      category,
      topRated: ranked.slice(0, CATEGORY_TOP_RATED_COUNT),
      others: ranked.slice(CATEGORY_TOP_RATED_COUNT),
    };
  }

  async search(query: string): Promise<Product[]> {
    // Fake Store has no search API — filter server-side on title + description
    const term = query.trim().toLowerCase();
    if (!term) {
      return [];
    }
    const products = await this.productSource.getAll();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  }

  async getById(id: number): Promise<Product | null> {
    return this.productSource.getById(id);
  }
}

export function sortByRating(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    if (b.rating.rate !== a.rating.rate) {
      return b.rating.rate - a.rating.rate;
    }
    if (b.rating.count !== a.rating.count) {
      return b.rating.count - a.rating.count;
    }
    return a.id - b.id;
  });
}