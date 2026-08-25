'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Category, 
  ProductType, 
  getSubtypesForProductType 
} from "@/lib/classification.enum";
import { Loader2, Tag, Check, Star } from "lucide-react";
import { notifySuccess, notifyError } from "@/components/helpers/Toast";
import { compressImage } from "@/lib/compressImage";

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
  tags: string; 
}

interface ProductFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
}

const defaultValues: FormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  productType: "",
  rings_subtype: "",
  earrings_subtype: "",
  chains_subtype: "",
  bracelets_subtype: "",
  pendants_subtype: "",
  imageUrl: "",
  tags: "",
};

export default function ProductForm({ initialValues, onSubmit, onCancel }: ProductFormProps) {
  const getInitialStringValue = (val: any) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val.name) return val.name;
    return "";
  };

  const [formData, setFormData] = useState<FormData>({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    // ✅ SENIOR: Tomamos el precio tal cual viene del Backend (sin * 1000)
    price: initialValues?.price ? Number(initialValues.price) : "",
    stock: initialValues?.stock || "",
    category: getInitialStringValue(initialValues?.category),
    productType: getInitialStringValue(initialValues?.productType),
    rings_subtype: initialValues?.rings_subtype || "",
    earrings_subtype: initialValues?.earrings_subtype || "",
    chains_subtype: initialValues?.chains_subtype || "",
    bracelets_subtype: initialValues?.bracelets_subtype || "",
    pendants_subtype: initialValues?.pendants_subtype || "",
    imageUrl: initialValues?.imageUrl || "",
    tags: Array.isArray(initialValues?.tags) ? initialValues.tags.join(", ") : "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialValues?.imageUrl || null);
  const [subtypes, setSubtypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

  const commonTags = ["destacado", "promo", "nueva colección", "sale"];

  useEffect(() => {
    if (formData.productType) {
      const subtypesMap = getSubtypesForProductType(formData.productType);
      setSubtypes(Object.values(subtypesMap));
    } else {
      setSubtypes([]);
    }
  }, [formData.productType]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags.split(",").map(t => t.trim().toLowerCase()).filter(t => t !== "");
    if (currentTags.includes(tag)) {
      const newTags = currentTags.filter(t => t !== tag);
      setFormData({ ...formData, tags: newTags.join(", ") });
    } else {
      const newTags = [...currentTags, tag];
      setFormData({ ...formData, tags: newTags.join(", ") });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    // Redimensiona/comprime en el navegador antes de guardarla en el estado.
    // Fotos de cámara (Mac/iPhone vía app Fotos, en particular) suelen venir
    // a resolución original y pesar varios MB; esto evita que lleguen así
    // de pesadas a la subida (Cloudinary, timeouts, etc.).
    setProcessingImage(true);
    try {
      const optimizedFile = await compressImage(selectedFile);
      setFile(optimizedFile);
      setPreview(URL.createObjectURL(optimizedFile));
    } finally {
      setProcessingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEditing = Boolean(initialValues?.id);
    const token = localStorage.getItem("token");

    try {
      // ✅ SENIOR: Mandamos el precio exactamente como se escribió (sin / 1000)
      const productData = {
        ...formData,
        price: Number(formData.price), 
        stock: Number(formData.stock),
        tags: formData.tags.split(",").map(t => t.trim().toLowerCase()).filter(t => t !== ""),
      };

      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/products/${initialValues?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/products`;

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        const backendMessage = Array.isArray(errorBody?.message)
          ? errorBody.message.join(", ")
          : errorBody?.message;
        throw new Error(backendMessage || `Error al guardar producto (HTTP ${res.status})`);
      }
      const savedProduct = await res.json();

      if (file && savedProduct.id) {
        const imgForm = new FormData();
        imgForm.append("file", file);
        const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${savedProduct.id}/image`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: imgForm,
        });

        if (!imgRes.ok) {
          const errorBody = await imgRes.json().catch(() => null);
          const backendMessage = Array.isArray(errorBody?.message)
            ? errorBody.message.join(", ")
            : errorBody?.message;
          throw new Error(
            backendMessage || `El producto se creó, pero falló la subida de la imagen (HTTP ${imgRes.status})`
          );
        }
      }

      notifySuccess(isEditing ? "¡Pieza actualizada!" : "¡Nueva joya creada!");
      
      if (!isEditing) {
        setFormData(defaultValues);
        setPreview(null);
        setFile(null);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }

      onSubmit(savedProduct);
    } catch (err: any) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Nombre de la Joya</label>
        <input type="text" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-magnolia-lilac outline-none" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Precio (AR$)</label>
        <input type="number" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} required className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-magnolia-lilac outline-none font-bold" />
      </div>

      <div className="md:col-span-2 space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Descripción</label>
        <textarea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} rows={2} className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-magnolia-lilac outline-none" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Metal (Categoría)</label>
        <select value={formData.category} onChange={(e) => handleChange("category", e.target.value)} required className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-magnolia-lilac outline-none">
          <option value="">Seleccionar metal</option>
          {Object.values(Category).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Tipo de Producto</label>
        <select value={formData.productType} onChange={(e) => handleChange("productType", e.target.value)} required className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-magnolia-lilac outline-none">
          <option value="">Seleccionar tipo</option>
          {Object.values(ProductType).map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      {subtypes.length > 0 && (
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Subtipo Específico</label>
          <select
            value={
              formData.productType === ProductType.Rings ? formData.rings_subtype :
              formData.productType === ProductType.Earrings ? formData.earrings_subtype :
              formData.productType === ProductType.Chains ? formData.chains_subtype :
              formData.productType === ProductType.Bracelets ? formData.bracelets_subtype :
              formData.productType === ProductType.Pendants ? formData.pendants_subtype : ""
            }
            onChange={(e) => {
              const fieldMap: any = {
                [ProductType.Rings]: "rings_subtype",
                [ProductType.Earrings]: "earrings_subtype",
                [ProductType.Chains]: "chains_subtype",
                [ProductType.Bracelets]: "bracelets_subtype",
                [ProductType.Pendants]: "pendants_subtype",
              };
              handleChange(fieldMap[formData.productType], e.target.value);
            }}
            className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-magnolia-lilac outline-none"
          >
            <option value="">Seleccionar subtipo</option>
            {subtypes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Stock</label>
        <input type="number" value={formData.stock} onChange={(e) => handleChange("stock", e.target.value)} required className="w-full border border-gray-200 px-4 py-3 rounded-sm focus:border-magnolia-lilac outline-none" />
      </div>

      <div className="md:col-span-2 space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-black text-magnolia-dark flex items-center gap-2 tracking-[0.2em]">
            <Tag size={12} /> Etiquetas y Promociones
          </label>
          <span className="text-[9px] text-gray-400 italic font-serif">Marcá {"destacado"} para la Home</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => {
            const isActive = formData.tags.toLowerCase().includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1 border ${
                  isActive 
                    ? "bg-magnolia-dark border-magnolia-dark text-white shadow-md" 
                    : "bg-white border-gray-200 text-gray-400 hover:border-magnolia-lilac"
                }`}
              >
                {isActive && (tag === "destacado" ? <Star size={10} fill="currentColor" /> : <Check size={10} />)}
                {tag}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <input 
            type="text" 
            placeholder="Escribí otras etiquetas separadas por coma..."
            value={formData.tags} 
            onChange={(e) => handleChange("tags", e.target.value)}
            className="w-full border-b border-gray-200 bg-transparent px-2 py-2 text-xs outline-none focus:border-magnolia-lilac font-medium text-gray-600"
          />
        </div>
      </div>

      <div className="md:col-span-2 pt-4 border-t border-gray-50 flex items-center gap-6">
        <div className="relative w-24 h-24 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
          {preview ? <Image src={preview} alt="Preview" fill className="object-cover" /> : <span className="text-[8px] text-gray-400 uppercase">Sin imagen</span>}
        </div>
        <div className="flex flex-col gap-1">
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={processingImage} className="text-[10px] text-gray-400" />
          {processingImage && (
            <span className="text-[9px] text-gray-400 flex items-center gap-1">
              <Loader2 className="animate-spin" size={10} /> Optimizando imagen...
            </span>
          )}
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end gap-4 pt-6">
        {onCancel && <button type="button" onClick={onCancel} className="text-[10px] font-bold uppercase text-gray-400">Cancelar</button>}
        <button type="submit" disabled={loading || processingImage} className="bg-magnolia-dark text-white px-10 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-magnolia-lilac transition-all">
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Guardar Joya"}
        </button>
      </div>
    </form>
  );
}