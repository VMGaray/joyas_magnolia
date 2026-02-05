'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Category, 
  ProductType, 
  getSubtypesForProductType 
} from "@/lib/classification.enum";

interface FormData {
  name: string;
  description: string;
  price: string | number;
  stock: string | number;
  category: string;
  productType: string;
  rings_subtype: string;
  earrings_subtype: string;
  chains_subtype: string;
  bracelets_subtype: string;
  pendants_subtype: string;
  imageUrl: string;
}

interface ProductFormProps {
  initialValues?: Partial<FormData>;
  onSubmit: (values: FormData) => void;
  onCancel?: () => void;
}


export default function ProductForm({ initialValues, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    price: initialValues?.price || "",
    stock: initialValues?.stock || "",
    category: initialValues?.category || "",
    productType: initialValues?.productType || "",
    rings_subtype: initialValues?.rings_subtype || "",
    earrings_subtype: initialValues?.earrings_subtype || "",
    chains_subtype: initialValues?.chains_subtype || "",
    bracelets_subtype: initialValues?.bracelets_subtype || "",
    pendants_subtype: initialValues?.pendants_subtype || "",
    imageUrl: initialValues?.imageUrl || "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [subtypes, setSubtypes] = useState<string[]>([]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Si cambió el tipo de producto, obtener los subtipos
    if (field === "productType" && value) {
      const subtypesMap = getSubtypesForProductType(value);
      setSubtypes(Object.values(subtypesMap));
    }
  };

  useEffect(() => {
    // Si ya hay un tipo de producto seleccionado, cargar sus subtipos
    if (formData.productType) {
      const subtypesMap = getSubtypesForProductType(formData.productType);
      setSubtypes(Object.values(subtypesMap));
    }
  }, [formData.productType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", String(formData.price));
    form.append("stock", String(formData.stock));
    form.append("category", formData.category);
    form.append("productType", formData.productType);

    if (formData.productType === ProductType.Rings && formData.rings_subtype) {
      form.append("rings_subtype", formData.rings_subtype);
    }
    if (formData.productType === ProductType.Earrings && formData.earrings_subtype) {
      form.append("earrings_subtype", formData.earrings_subtype);
    }
    if (formData.productType === ProductType.Chains && formData.chains_subtype) {
      form.append("chains_subtype", formData.chains_subtype);
    }
    if (formData.productType === ProductType.Bracelets && formData.bracelets_subtype) {
      form.append("bracelets_subtype", formData.bracelets_subtype);
    }
    if (formData.productType === ProductType.Pendants && formData.pendants_subtype) {
      form.append("pendants_subtype", formData.pendants_subtype);
    }

    if (file) {
      form.append("file", file);
    }

    try {
      const res = await fetch("http://localhost:4000/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Error al crear producto");
      const data = await res.json();
      onSubmit(data);
    } catch (err) {
      console.error("❌ Error al crear producto:", err);
    }
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
    value={formData.category}
    onChange={(e) => handleChange("category", e.target.value)}
    required
    className="w-full border px-3 py-2 rounded"
  >
    <option value="">Seleccionar categoría</option>
    {Object.values(Category).map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>

{/* Tipo de producto */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">Tipo de producto</label>
  <select
    value={formData.productType}
    onChange={(e) => handleChange("productType", e.target.value)}
    required
    className="w-full border px-3 py-2 rounded"
  >
    <option value="">Seleccionar tipo</option>
    {Object.values(ProductType).map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>


{/* Subtipo dinámico - SELECT en lugar de INPUT */}
{formData.productType && [ProductType.Rings, ProductType.Earrings, ProductType.Chains, ProductType.Bracelets, ProductType.Pendants].includes(formData.productType as ProductType) && (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Subtipo {formData.productType && `(${formData.productType})`}
    </label>
    {!subtypes.length ? (
      <p className="text-xs text-gray-400">No hay subtipos disponibles para este tipo</p>
    ) : (
      <select
        value={
          formData.productType === ProductType.Rings
            ? formData.rings_subtype
            : formData.productType === ProductType.Earrings
            ? formData.earrings_subtype
            : formData.productType === ProductType.Chains
            ? formData.chains_subtype
            : formData.productType === ProductType.Bracelets
            ? formData.bracelets_subtype
            : formData.productType === ProductType.Pendants
            ? formData.pendants_subtype
            : ""
        }
        onChange={(e) => {
          if (formData.productType === ProductType.Rings) handleChange("rings_subtype", e.target.value);
          else if (formData.productType === ProductType.Earrings) handleChange("earrings_subtype", e.target.value);
          else if (formData.productType === ProductType.Chains) handleChange("chains_subtype", e.target.value);
          else if (formData.productType === ProductType.Bracelets) handleChange("bracelets_subtype", e.target.value);
          else if (formData.productType === ProductType.Pendants) handleChange("pendants_subtype", e.target.value);
        }}
        className="w-full border px-3 py-2 rounded focus:outline-none focus:border-magnolia-lilac"
      >
        <option value="">Seleccionar subtipo</option>
        {subtypes.map((subtype) => (
          <option key={subtype} value={subtype}>
            {subtype}
          </option>
        ))}
      </select>
    )}
  </div>
)}

            {/* Imagen */}
      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {preview && (
          <div className="relative w-32 h-32 rounded border mt-2 overflow-hidden">
            <Image
              src={preview}
              alt="Vista previa"
              fill
              className="object-cover"
            />
          </div>
        )}
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
