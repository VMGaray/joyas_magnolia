'use client';

import ProductForm from "./ProductForm";
import { useProducts } from "@/lib/hooks";

export default function CrearProducto() {
  const { mutate } = useProducts();

  async function handleCreate(values: any) {
    try {
      // 1. Crear producto
      const res = await fetch("http://localhost:4000/products", {
        method: "POST",
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

      if (!res.ok) throw new Error("Error al crear producto");
      const product = await res.json();

      // 2. Subir imagen si existe
      if (product?.id && values.image) {
        const formData = new FormData();
        formData.append("image", values.image);

        const imgRes = await fetch(`http://localhost:4000/products/${product.id}/image`, {
          method: "PUT",
          body: formData,
        });

        if (!imgRes.ok) throw new Error("Error al subir imagen");
      }

      mutate(); // 🔄 refresca la lista
      alert("✅ Producto creado con éxito");
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Hubo un problema al crear el producto");
    }
  }

  return (
    <ProductForm
      onSubmit={handleCreate}
    />
  );
}
