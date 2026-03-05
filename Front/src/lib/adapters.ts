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
  tags: string[]; // ✅ Nuevo campo de etiquetas
  isFeatured: boolean; // ✅ Ahora depende de si existe el tag "destacado"
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-AR', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })}`;
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

  const inputPrice = Number(backendProduct.price || 0);
  const realPrice = inputPrice < 1000 ? inputPrice * 1000 : inputPrice;

  const productTypeName = typeof backendProduct.productType === 'string'
    ? backendProduct.productType
    : (backendProduct.productType as any)?.name;

  const categoryName = typeof backendProduct.category === 'string'
    ? backendProduct.category
    : (backendProduct.category as any)?.name;

  // ✅ Procesamos los tags del backend
  const productTags = Array.isArray(backendProduct.tags) ? backendProduct.tags : [];

  return {
    id: String(backendProduct.id), 
    name: backendProduct.name,
    price: realPrice,
    formattedPrice: formatPrice(realPrice),
    image: image,
    rating: 5,
    description: backendProduct.description || "",
    category: toSlug(productTypeName || 'sin-tipo'),
    material: categoryToMaterial(categoryName || 'sin-categoria'),
    images: [image],
    stock: typeof backendProduct.stock === "number" ? backendProduct.stock : 0,
    tags: productTags,
    // ✅ Es destacado si incluye la palabra exacta en minúsculas
    isFeatured: productTags.includes("destacado"), 
  };
}

export function adaptBackendProducts(backendProducts: BackendProduct[]): FrontendProduct[] {
  if (!backendProducts || !Array.isArray(backendProducts)) {
    console.error("🚨 Error en adaptador:", backendProducts);
    return []; 
  }
  return backendProducts.map(adaptBackendProduct);
}