import { BackendProduct } from './api';

// Tipo del producto que usa el frontend
export interface FrontendProduct {
  id: number;
  name: string;
  price: number;
  formattedPrice: string;
  image: string;
  rating: number;
  description: string;
  category: string; // slug del tipo de producto (anillos, pulseras, etc.)
  material: string; // slug de la categoría (plata-925, oro-18kl, enchapado)
  images: string[];
  stock: number;
  
}

// Convierte nombres a slugs
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

// Formatea el precio al estilo argentino
function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Convierte categoría del backend a material del frontend
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

// Adapta un producto del backend al formato del frontend
export function adaptBackendProduct(backendProduct: BackendProduct): FrontendProduct {
  const defaultImage = '/cat-anillos.jpg';
  const image = backendProduct.imageUrl && !backendProduct.imageUrl.includes('ejemplo.com')
    ? backendProduct.imageUrl
    : defaultImage;

  // support backendProduct.category/productType as either string or object { id, name }
  const productTypeName = typeof backendProduct.productType === 'string'
    ? backendProduct.productType
    : (backendProduct.productType as any)?.name;

  const categoryName = typeof backendProduct.category === 'string'
    ? backendProduct.category
    : (backendProduct.category as any)?.name;

  return {
    id: backendProduct.id,
    name: backendProduct.name,
    price: backendProduct.price,
    formattedPrice: formatPrice(backendProduct.price),
    image: image,
    rating: 5,
    description: backendProduct.description,
    category: toSlug(productTypeName || 'sin-tipo'),
    material: categoryToMaterial(categoryName || 'sin-categoria'),
    images: [image],
    stock: typeof backendProduct.stock === "number" ? backendProduct.stock : 0,
  };
}


// Adapta un array de productos
export function adaptBackendProducts(backendProducts: BackendProduct[]): FrontendProduct[] {
  // 🛡️ PROTECCIÓN: Si no es un array, devolvemos lista vacía y no rompemos la app
  if (!backendProducts || !Array.isArray(backendProducts)) {
    console.error("🚨 Error en adaptador: Se esperaba un array pero llegó:", backendProducts);
    return []; 
  }

  // Si todo está bien, hacemos el mapa
  return backendProducts.map(adaptBackendProduct);
}
