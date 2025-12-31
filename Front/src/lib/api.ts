const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Tipos del backend
export interface Category {
  id: number;
  name: string;
}

export interface ProductType {
  id: number;
  name: string;
  category?: Category;
}

export interface Subtype {
  id: number;
  name: string;
  productType?: ProductType;
}

export interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number; // ✅ obligatorio
  imageUrl?: string | null;
  category?: { id: number; name: string } | null;
  productType?: { id: number; name: string } | null;
  subtype?: { id: number; name: string } | null;
}

// Filtros para productos
export interface ProductFilters {
  category?: string;
  type?: string;
  subtype?: string;
}

// 🔹 Helper para incluir token en cada request
async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

// 🔹 Funciones de API

export async function getProducts(filters?: ProductFilters): Promise<BackendProduct[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.type) params.append("type", filters.type);
  if (filters?.subtype) params.append("subtype", filters.subtype);

  const queryString = params.toString();
  const url = `${API_URL}/products${queryString ? `?${queryString}` : ""}`;

  return apiFetch(url);
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch(`${API_URL}/products/categories`);
}

export async function getProductTypes(): Promise<ProductType[]> {
  return apiFetch(`${API_URL}/products/product-types`);
}

export async function getSubtypes(): Promise<Subtype[]> {
  return apiFetch(`${API_URL}/products/subtypes`);
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: number;
  productTypeId?: number;
  subtypeId?: number;
}): Promise<BackendProduct> {
  return apiFetch(`${API_URL}/products`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Partial<BackendProduct>): Promise<BackendProduct> {
  return apiFetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return apiFetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
}
