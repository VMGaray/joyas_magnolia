import Image from "next/image";

export default function ProductRow({ product, onEdit, onDelete }: any) {
  return (
    <tr>
      <td className="border px-4 py-2">
        <Image src={product.image} alt={product.name} width={80} height={80} className="object-cover rounded" />
      </td>
      <td className="border px-4 py-2">{product.name}</td>
      <td className="border px-4 py-2">{product.formattedPrice}</td>
      <td className="border px-4 py-2">{product.stock}</td>
      <td className="border px-4 py-2">{product.category}</td>
      <td className="border px-4 py-2">{product.material}</td>
      <td className="border px-4 py-2 space-x-2">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
