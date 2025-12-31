'use client';

import { useState } from "react";
import { useProducts } from "@/lib/hooks";
import { adaptBackendProducts } from "@/lib/adapters";
import ProductTable from "./ProductTable";
import EditProductModal from "./EditProductModal";
import { deleteProduct, updateProduct } from "@/lib/api";

export default function ListaProductos() {
  const { products: backendProducts, isLoading, isError, mutate } = useProducts();
  const products = adaptBackendProducts(backendProducts || []);

  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      mutate();
      alert("Producto eliminado");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto");
    }
  }

  async function handleUpdate(productData: any) {
    try {
      await updateProduct(productData.id, productData);
      mutate();
      setEditingProduct(null);
      alert("Producto actualizado");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar producto");
    }
  }

  if (isLoading) return <p className="p-6">Cargando productos...</p>;
  if (isError) return <p className="p-6 text-red-500">Error al cargar productos</p>;

  return (
    <section className="p-6">
      <h2 className="text-2xl font-serif mb-4">Lista de Productos</h2>
      <ProductTable
        products={products}
        onEdit={setEditingProduct}
        onDelete={handleDelete}
      />
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}
    </section>
  );
}
