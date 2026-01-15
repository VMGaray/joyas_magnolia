'use client';

import CrearProducto from "@/components/Admin/CrearProducto";
import ListaProductos from "@/components/Admin/ListaProductos";

export default function Page() {
  return (
    <div className="space-y-12 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
      <CrearProducto />
      <ListaProductos />
    </div>
  );
}

