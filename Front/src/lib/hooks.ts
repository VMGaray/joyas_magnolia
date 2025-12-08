import useSWR from 'swr';
import { getProducts, getCategories, getProductTypes, getSubtypes, type BackendProduct, type Category, type ProductType, type Subtype, type ProductFilters } from './api';

// Hook para obtener productos con filtros opcionales
export function useProducts(filters?: ProductFilters) {
  const key = filters ? ['products', filters] : 'products';

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getProducts(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    products: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook para obtener categorías
export function useCategories() {
  const { data, error, isLoading } = useSWR<Category[]>(
    'categories',
    getCategories,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    categories: data,
    isLoading,
    isError: error,
  };
}

// Hook para obtener tipos de productos
export function useProductTypes() {
  const { data, error, isLoading } = useSWR<ProductType[]>(
    'product-types',
    getProductTypes,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    productTypes: data,
    isLoading,
    isError: error,
  };
}

// Hook para obtener subtipos
export function useSubtypes() {
  const { data, error, isLoading } = useSWR<Subtype[]>(
    'subtypes',
    getSubtypes,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    subtypes: data,
    isLoading,
    isError: error,
  };
}
