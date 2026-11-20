import type { CategoryProducts, Product } from "../types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export const api = {
  getFeatured: () => request<Product[]>("/api/products/featured"),
  getCategories: () => request<string[]>("/api/categories"),
  getCategory: (name: string) =>
    request<CategoryProducts>(`/api/categories/${encodeURIComponent(name)}`),
  search: (q: string) =>
    request<Product[]>(`/api/products/search?q=${encodeURIComponent(q)}`),
  getProduct: (id: number) => request<Product>(`/api/products/${id}`),
  submitEnquiry: (payload: {
    name: string;
    email: string;
    message: string;
    productId: number;
    productTitle?: string;
  }) =>
    request<{ ok: boolean }>("/api/enquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};