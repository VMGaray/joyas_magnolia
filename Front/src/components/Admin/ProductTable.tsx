'use client';

import ProductRow from "./ProductRow";

export default function ProductTable({ products, onEdit, onDelete }: any) {
  return (
    <div className="w-full">
      {/* Tabla en pantallas medianas y grandes */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Imagen</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Precio</th>
              <th className="border px-4 py-2">Stock</th>
              <th className="border px-4 py-2">Categoría</th>
              <th className="border px-4 py-2">Material</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <ProductRow
                key={p.id}
                product={p}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista tipo cards en pantallas chicas */}
      <div className="md:hidden space-y-4">
        {products.map((p: any) => (
          <div
            key={p.id}
            className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
              </div>
            </div>

            <p><strong>Precio:</strong> {p.formattedPrice}</p>
            <p><strong>Stock:</strong> {p.stock}</p>
            <p><strong>Material:</strong> {p.material}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onEdit(p)}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
