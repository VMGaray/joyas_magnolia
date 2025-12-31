import ProductRow from "./ProductRow";

export default function ProductTable({ products, onEdit, onDelete }: any) {
  return (
    <table className="w-full border-collapse border border-gray-300">
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
          <ProductRow key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}
