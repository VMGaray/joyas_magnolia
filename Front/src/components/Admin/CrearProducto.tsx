'use client';

import ProductForm from "./ProductForm";
import { useProducts } from "@/lib/hooks";

export default function CrearProducto() {
  const { mutate } = useProducts();

  // 'values' aquí ya es el producto guardado que devuelve el backend
  async function handleSuccess() {
    await mutate(); // Refresca la lista de productos
    // El alert ya lo hace el ProductForm internamente, no hace falta aquí.
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