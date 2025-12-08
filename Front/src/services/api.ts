import { BackendProduct } from "../types/backend";

const API_URL = "http://localhost:4000"; // El puerto del backend de tu compañera

interface ProductFilters {
  category?: string;
  type?: string;
  subtype?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(filters: ProductFilters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) params.append("category", filters.category);
    if (filters.type) params.append("type", filters.type);
    if (filters.subtype) params.append("subtype", filters.subtype);
    
    params.append("limit", (filters.limit || 50).toString());
    params.append("page", (filters.page || 1).toString());

    console.log(`📡 Conectando al Back: ${API_URL}/products?${params.toString()}`);
    
    const res = await fetch(`${API_URL}/products?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Backend no responde");
    }

    const data = await res.json();
    // Ajuste por si el back devuelve paginación o array directo
    const products: BackendProduct[] = Array.isArray(data) ? data : (data.data || []);
    
    console.log("✅ Productos recibidos:", products.length);
    return products;
    
  } catch (error) {
    console.error("⚠️ Usando modo offline (Backend no responde):", error);
    return null;
  }
}