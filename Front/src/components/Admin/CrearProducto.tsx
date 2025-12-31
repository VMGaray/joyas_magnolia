'use client';

import { useState } from "react";
import { useProducts, useCategories, useProductTypes, useSubtypes } from "@/lib/hooks";

export default function CrearProducto() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [productTypeId, setProductTypeId] = useState<number | null>(null);
  const [subtypeId, setSubtypeId] = useState<number | null>(null);

  const { mutate } = useProducts();
  const { categories } = useCategories();
  const { productTypes } = useProductTypes();
  const { subtypes } = useSubtypes();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !description || !price || !stock) {
      alert("Por favor completá todos los campos obligatorios");
      return;
    }

    try {
      // 1. Crear producto
      const res = await fetch("http://localhost:4000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          categoryId: categoryId || null,
          productTypeId: productTypeId || null,
          subtypeId: subtypeId || null,
        }),
      });

      if (!res.ok) throw new Error("Error al crear producto");
      const product = await res.json();

      // 2. Subir imagen
      if (product?.id && image) {
        const formData = new FormData();
        formData.append("image", image);

        const imgRes = await fetch(`http://localhost:4000/products/${product.id}/image`, {
          method: "PUT",
          body: formData,
        });

        if (!imgRes.ok) throw new Error("Error al subir imagen");
      }

      mutate(); // 🔄 refresca la lista
      alert("✅ Producto creado con éxito");

      // Resetear formulario
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImage(null);
      setCategoryId(null);
      setProductTypeId(null);
      setSubtypeId(null);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Hubo un problema al crear el producto");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Categoría</label>
        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar categoría</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={productTypeId ?? ""}
          onChange={(e) => setProductTypeId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar tipo</option>
          {productTypes?.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Subtipo</label>
        <select
          value={subtypeId ?? ""}
          onChange={(e) => setSubtypeId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar subtipo</option>
          {subtypes
            ?.filter((s) => s.productType?.id === productTypeId)
            .map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      <div className="col-span-2">
        <button
          type="submit"
          className="bg-magnolia-dark text-white px-6 py-2 rounded hover:bg-magnolia-lilac transition"
        >
          Crear producto
        </button>
      </div>
    </form>
  );
}
