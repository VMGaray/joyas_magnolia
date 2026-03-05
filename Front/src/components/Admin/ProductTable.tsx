'use client';

import { Edit2, Trash2, Star } from "lucide-react";

export default function ProductTable({ products, onEdit, onDelete }: any) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 border-b border-gray-100">
          <th className="px-6 py-4">Imagen</th>
          <th className="px-6 py-4">Nombre</th>
          <th className="px-6 py-4">Destacado</th> {/* ✅ Nueva Columna */}
          <th className="px-6 py-4">Precio</th>
          <th className="px-6 py-4">Stock</th>
          <th className="px-6 py-4 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {products.map((product: any) => (
          <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
            <td className="px-6 py-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 relative bg-gray-50">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">{product.name}</span>
                <span className="text-[9px] text-gray-400 font-mono">ID: {product.id.slice(0, 6).toUpperCase()}</span>
              </div>
            </td>
            
            {/* ✅ INDICADOR DE DESTACADO */}
            <td className="px-6 py-4">
              {product.isFeatured ? (
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 w-fit px-2 py-1 rounded-full border border-yellow-100">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[9px] font-black uppercase">Sí</span>
                </div>
              ) : (
                <span className="text-[9px] text-gray-300 uppercase font-bold tracking-widest pl-2">No</span>
              )}
            </td>

            <td className="px-6 py-4 text-sm font-black text-magnolia-dark">
              {product.formattedPrice}
            </td>
            <td className="px-6 py-4">
              <span className={`text-xs font-bold ${product.stock < 5 ? "text-red-500" : "text-gray-500"}`}>
                {product.stock} un.
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={() => onEdit(product)}
                  className="p-2 text-gray-400 hover:text-magnolia-dark hover:bg-magnolia-lil/10 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}