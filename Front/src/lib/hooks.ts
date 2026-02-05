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

// Hook para obtener métricas de ventas
export function useMetricsSales() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  
  const { data, error, isLoading, mutate } = useSWR(
    'admin/metrics/sales',
    async () => {
      const res = await fetch(`${API_URL}/admin/metrics/sales`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      });
      if (!res.ok) throw new Error('Error fetching sales metrics');
      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    salesMetrics: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook para obtener métricas de órdenes
export function useMetricsOrders() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  
  const { data, error, isLoading, mutate } = useSWR(
    'admin/metrics/orders',
    async () => {
      const res = await fetch(`${API_URL}/admin/metrics/orders`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      });
      if (!res.ok) throw new Error('Error fetching orders metrics');
      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    ordersMetrics: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook para obtener órdenes
export function useOrders() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  
  const { data, error, isLoading, mutate } = useSWR(
    'orders',
    async () => {
      const res = await fetch(`${API_URL}/order`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      });
      if (!res.ok) throw new Error('Error fetching orders');
      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    orders: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook para obtener una orden específica
export function useOrder(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  
  const { data, error, isLoading } = useSWR(
    id ? `order/${id}` : null,
    async () => {
      const res = await fetch(`${API_URL}/order/${id}`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      });
      if (!res.ok) throw new Error('Error fetching order');
      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    order: data,
    isLoading,
    isError: error,
  };
}
