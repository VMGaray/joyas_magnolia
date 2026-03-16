'use client';

import { BackendProduct } from './api';

export interface FrontendProduct {
  id: string; 
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  rating: number;
  description: string;
  category: string; 
  material: string; 
  images: string[];
  stock: number;
  tags: string[];
  isFeatured: boolean;
}

function toSlug(text: string): string {
  if (!text) return "";
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

/**
 * ✅ Única fuente de verdad para el formato de moneda.
 */
export function formatPrice(price: number): string {
  return `$${Math.round(price).toLocaleString('es-AR')}`;
}

function categoryToMaterial(categoryName: string): string {
  const mapping: Record<string, string> = {
    'Plata 925': 'plata-925',
    'Oro 18 k': 'oro-18kl',
    'Enchapados': 'enchapado',
    'Insumos': 'insumos',
    'Personalizados': 'personalizados',
  };
  return mapping[categoryName] || toSlug(categoryName);
}

export function adaptBackendProduct(backendProduct: BackendProduct): FrontendProduct {
  const defaultImage = '/cat-anillos.jpg';
  const image = backendProduct.imageUrl && !backendProduct.imageUrl.includes('ejemplo.com')
    ? backendProduct.imageUrl
    : defaultImage;

  /**
   * 💰 LÓGICA DE PRECIOS LIMPIA (Senior):
   * El precio del backend es la única fuente de verdad.
   * Sin parches ni multiplicaciones arbitrarias.
   */
  const rawPrice = Number(backendProduct.price || 0);

  const productTypeName = typeof backendProduct.productType === 'string'
    ? backendProduct.productType
    : (backendProduct.productType as any)?.name;

  const categoryName = typeof backendProduct.category === 'string'
    ? backendProduct.category
    : (backendProduct.category as any)?.name;

  const productTags = Array.isArray((backendProduct as any).tags) 
    ? (backendProduct as any).tags 
    : [];

  return {
    id: String(backendProduct.id), 
    name: backendProduct.name,
    price: rawPrice, 
    formattedPrice: formatPrice(rawPrice),
    image: image,
    rating: 5,
    description: backendProduct.description || "",
    category: toSlug(productTypeName || 'sin-tipo'),
    material: categoryToMaterial(categoryName || 'sin-categoria'),
    images: [image],
    stock: typeof backendProduct.stock === "number" ? backendProduct.stock : 0,
    tags: productTags,
    isFeatured: productTags.includes("destacado") || productTags.includes("Destacado"), 
  };
}

export function adaptBackendProducts(backendProducts: BackendProduct[]): FrontendProduct[] {
  if (!backendProducts || !Array.isArray(backendProducts)) return []; 
  return backendProducts.map(adaptBackendProduct);
}