import type { Product } from "../types/product.js";

/** Swappable so Fake Store / DB / CMS can change without touching routes. */
export interface ProductSource {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  getCategories(): Promise<string[]>;
  getByCategory(category: string): Promise<Product[]>;
}