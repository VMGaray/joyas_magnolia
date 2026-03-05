'use client';

import { useState } from "react";
import { useProducts } from "@/lib/hooks";
import { adaptBackendProducts } from "@/lib/adapters";
import ProductTable from "./ProductTable";
import EditProductModal from "./EditProductModal";
import ConfirmModal from "../ConfirmModal";
import { deleteProduct } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { notifySuccess, notifyError } from "@/components/helpers/Toast";

export default function ListaProductos() {
  const { products: backendProducts, isLoading, isError, mutate } = useProducts();

  // Dejamos que el adaptador haga el trabajo de multiplicar y formatear
  const products = adaptBackendProducts(backendProducts || []);

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
  };

  async function handleDelete() {
    if (!productToDelete) return;
    setIsProcessing(true);
    try {
      await deleteProduct(productToDelete);
      await mutate(); 
      notifySuccess("Joya eliminada del catálogo");
      setProductToDelete(null); 
    } catch (err) {
      console.error(err);
      notifyError("No se pudo eliminar el producto");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleUpdate() {
    setIsProcessing(true);
    try {
      await mutate(); 
      setEditingProduct(null); 
    } catch (err) {
      console.error("Error al refrescar:", err);
      notifyError("Error al actualizar la vista");
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoading) return (
    <div className="p-12 flex flex-col items-center gap-3">
       <Loader2 className="animate-spin text-magnolia-lilac" size={32} />
       <p className="text-gray-400 font-serif italic uppercase text-[10px] tracking-widest">Cargando catálogo...</p>
    </div>
  );

  if (isError) return (
    <div className="p-12 text-center text-red-500 bg-red-50 border border-red-100 rounded-lg font-sans text-sm">
      Error al conectar con la base de datos de Magnolia.
    </div>
  );

  return (
    <section className="space-y-6">
      {/* TÍTULO ÚNICO: Aquí se gestiona el título de la sección */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-serif text-magnolia-dark tracking-tight">Inventario de Joyas</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Gestión de Stock y Precios</p>
        </div>
        <span className="text-[10px] bg-magnolia-dark text-white px-4 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-sm">
          {products.length} Items
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ProductTable
          products={products}
          onEdit={setEditingProduct}
          onDelete={confirmDelete}
        />
      </div>

      <ConfirmModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        loading={isProcessing}
        title="¿Eliminar esta pieza?"
        message="Esta acción es permanente y la pieza desaparecerá de Magnolia Joyas."
      />

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => !isProcessing && setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}
      
      {isProcessing && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[150] flex items-center justify-center">
          <Loader2 className="animate-spin text-magnolia-lilac" size={48} />
        </div>
      )}
    </section>
  );
}