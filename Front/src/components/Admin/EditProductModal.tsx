'use client';

import ProductForm from "./ProductForm";

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onSave?: () => void; // opcional si querés refrescar lista desde afuera
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  async function handleUpdate(values: any) {
    try {
      // 1. Actualizar datos del producto
      const res = await fetch(`http://localhost:4000/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          price: Number(values.price),
          stock: Number(values.stock),
          categoryId: values.categoryId || null,
          productTypeId: values.productTypeId || null,
          subtypeId: values.subtypeId || null,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar producto");

      // 2. Subir nueva imagen si existe
      if (values.image) {
        const formData = new FormData();
        formData.append("file", values.image); // 👈 el backend espera "file"

        const imgRes = await fetch(`http://localhost:4000/products/${product.id}/image`, {
          method: "PUT",
          body: formData,
        });

        if (!imgRes.ok) throw new Error("Error al subir imagen");
      }

      alert("✅ Producto actualizado con éxito");
      if (onSave) onSave(); // refrescar lista si el padre lo necesita
      onClose(); // cerrar modal
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Hubo un problema al actualizar el producto");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-serif mb-4">Editar Producto</h3>
        <ProductForm
          initialValues={product}
          onSubmit={handleUpdate}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
