'use client';

import { useState } from "react";
import { useCategories, useProductTypes, useSubtypes } from "@/lib/hooks";

interface ProductFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
}

export default function ProductForm({ initialValues, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    price: initialValues?.price || "",
    stock: initialValues?.stock || "",
    categoryId: initialValues?.categoryId || "",
    productTypeId: initialValues?.productTypeId || "",
    subtypeId: initialValues?.subtypeId || "",
    image: null,
  });

  const { categories } = useCategories();
  const { productTypes } = useProductTypes();
  const { subtypes } = useSubtypes();

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow">
      {/* Nombre */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Descripción */}
      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Stock */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Categoría */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Categoría</label>
        <select
          value={formData.categoryId}
          onChange={(e) => handleChange("categoryId", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar categoría</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Tipo */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={formData.productTypeId}
          onChange={(e) => handleChange("productTypeId", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar tipo</option>
          {productTypes?.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Subtipo */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Subtipo</label>
        <select
          value={formData.subtypeId}
          onChange={(e) => handleChange("subtypeId", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar subtipo</option>
          {subtypes
            ?.filter((s) => s.productType?.id === formData.productTypeId)
            .map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </select>
      </div>

      {/* Imagen */}
      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleChange("image", e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      {/* Botones */}
      <div className="col-span-2 flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="bg-magnolia-dark text-white px-6 py-2 rounded hover:bg-magnolia-lilac transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
