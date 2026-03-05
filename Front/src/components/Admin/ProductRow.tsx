'use client';

import Image from "next/image";
import { Edit3, Trash2 } from "lucide-react";

// Imagen por defecto si el producto no tiene una válida
const PLACEHOLDER_IMAGE = "/img/placeholder-joya.jpg";

export default function ProductRow({ product, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
          <Image
            src={product.image && product.image.trim() !== "" ? product.image : PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm font-bold text-gray-800">{product.name}</p>
        <p className="text-[10px] text-gray-400 font-mono uppercase">
          ID: {product.id?.toString().slice(0, 6)}
        </p>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-bold text-magnolia-dark">
          {/* ✅ Usamos formattedPrice que ya viene con el punto y el signo $ del adaptador */}
          {product.formattedPrice}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`text-xs font-bold ${product.stock < 5 ? "text-red-500" : "text-gray-600"}`}>
          {product.stock} un.
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 bg-purple-50 text-magnolia-lilac text-[10px] font-bold rounded-full uppercase tracking-tighter">
          {product.category || "General"}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {product.material || "---"}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-magnolia-dark hover:bg-magnolia-lilac/20 rounded-full transition-colors"
            title="Editar"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}