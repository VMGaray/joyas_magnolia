import { useCategories, useProductTypes, useSubtypes } from "@/lib/hooks";

export default function EditProductModal({ product, onClose, onSave }: any) {
  const { categories } = useCategories();
  const { productTypes } = useProductTypes();
  const { subtypes } = useSubtypes();

  function handleChange(field: string, value: any) {
    onSave({ ...product, [field]: value });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(product);
        }}
        className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4"
      >
        <h3 className="text-xl font-serif mb-4">Editar Producto</h3>

        <input
          type="text"
          value={product.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Nombre"
          required
        />

        <textarea
          value={product.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Descripción"
          required
        />

        <input
          type="number"
          value={product.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          placeholder="Precio"
          required
        />

        <input
          type="number"
          value={product.stock}
          onChange={(e) => handleChange("stock", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          placeholder="Stock"
          required
        />

        <select
          value={product.categoryId ?? ""}
          onChange={(e) => handleChange("categoryId", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar categoría</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={product.productTypeId ?? ""}
          onChange={(e) => handleChange("productTypeId", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar tipo</option>
          {productTypes?.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select
          value={product.subtypeId ?? ""}
          onChange={(e) => handleChange("subtypeId", Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar subtipo</option>
          {subtypes
            ?.filter((s) => s.productType?.id === product.productTypeId)
            .map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </select>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-magnolia-dark text-white px-4 py-2 rounded hover:bg-magnolia-lilac"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
