const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
  imageUrl: string | null;
  category: Category;
  productType: ProductType;
  subtype: Subtype | null;
}

// Filtros para productos
export interface ProductFilters {
  category?: string;
  type?: string;
  subtype?: string;
}

// Funciones de API

export async function getProducts(filters?: ProductFilters): Promise<BackendProduct[]> {
  const params = new URLSearchParams();

  if (filters?.category) params.append('category', filters.category);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.subtype) params.append('subtype', filters.subtype);

  const queryString = params.toString();
  const url = `${API_URL}/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }

  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/products/categories`);

  if (!response.ok) {
    throw new Error('Error al obtener categorías');
  }

  return response.json();
}

export async function getProductTypes(): Promise<ProductType[]> {
  const response = await fetch(`${API_URL}/products/product-types`);

  if (!response.ok) {
    throw new Error('Error al obtener tipos de productos');
  }

  return response.json();
}

export async function getSubtypes(): Promise<Subtype[]> {
  const response = await fetch(`${API_URL}/products/subtypes`);

  if (!response.ok) {
    throw new Error('Error al obtener subtipos');
  }

  return response.json();
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  productTypeId: number;
  subtypeId?: number;
}): Promise<BackendProduct> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear producto');
  }

  return response.json();
}
