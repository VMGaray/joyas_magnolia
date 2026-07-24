'use client';

import ProductForm from "./ProductForm";
import { useProducts } from "@/lib/hooks";
import type { BackendProduct } from "@/lib/api";

export default function CrearProducto() {
  const { mutate } = useProducts();

  // 'newProduct' es el producto guardado que devuelve el backend (POST 201)
  async function handleSuccess(newProduct: BackendProduct) {
    // Actualizamos el caché de SWR al instante con el producto recién creado
    // (mismo key 'products' que usa ListaProductos, así que se ve sin refrescar)
    // y revalidamos contra el backend para reconciliar datos derivados en el
    // servidor (p.ej. la imageUrl, que se sube en un PUT separado después del POST).
    await mutate(
      (current) => (Array.isArray(current) ? [...current, newProduct] : [newProduct]),
      { revalidate: true }
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
      <h2 className="text-2xl font-serif text-magnolia-dark mb-6">Cargar Nueva Joya</h2>
      <ProductForm
        onSubmit={handleSuccess}
      />
    </div>
  );
}