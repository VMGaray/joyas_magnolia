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
  id: string; // UUID
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

  const res = await apiFetch(url);
  // Backend returns a paginated object { data, total, page, limit, totalPages }
  // but some endpoints may return directly an array. Normalize to array.
  if (res && Array.isArray(res)) return res as BackendProduct[];
  if (res && res.data && Array.isArray(res.data)) return res.data as BackendProduct[];
  return [] as BackendProduct[];
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

// Orders - MODIFICADO PARA PRECIOS REALES
export async function createOrder(data: { 
  userId: string; 
  items: { productId: string; quantity: number; price?: number }[]; // Añadimos price opcional
  address?: any; 
}): Promise<any> {
  
  // Si el backend necesita el precio total calculado o precios individuales,
  // nos aseguramos de que viajen multiplicados por 1000 si los incluimos.
  
  return apiFetch(`${API_URL}/order`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Mercado Pago
export async function createPreference(data: { orderId: string; userId: string }): Promise<any> {
  // Obtenemos la URL base (http://localhost:3000 o tu dominio en Vercel)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const payload = {
    ...data,
    // Agregamos las URLs a donde MP debe volver al terminar
    back_urls: {
      success: `${baseUrl}/checkout/success`,
      failure: `${baseUrl}/checkout/failure`,
      pending: `${baseUrl}/checkout/pending`,
    },
    // Esto hace que si el pago es exitoso, vuelva solo a tu web
    auto_return: "approved", 
  };

  return apiFetch(`${API_URL}/mercado-pago/create-preference`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}