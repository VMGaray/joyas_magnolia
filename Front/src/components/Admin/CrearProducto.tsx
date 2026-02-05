'use client';

import ProductForm from "./ProductForm";
import { useProducts } from "@/lib/hooks";

export default function CrearProducto() {
  const { mutate } = useProducts();

 async function handleCreate(values: any) {
  try {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("stock", values.stock);

    formData.append("category", values.category);
    formData.append("productType", values.productType);

    // Subtipo según tipo
    if (values.productType === "anillos" && values.rings_subtype) {
      formData.append("rings_subtype", values.rings_subtype);
    }
    if (values.productType === "aros" && values.earrings_subtype) {
      formData.append("earrings_subtype", values.earrings_subtype);
    }
    if (values.productType === "cadenas" && values.chains_subtype) {
      formData.append("chains_subtype", values.chains_subtype);
    }
    if (values.productType === "pulseras" && values.bracelets_subtype) {
      formData.append("bracelets_subtype", values.bracelets_subtype);
    }
    if (values.productType === "dijes" && values.pendants_subtype) {
      formData.append("pendants_subtype", values.pendants_subtype);
    }

    // Imagen (si existe)
    if (values.image) {
      formData.append("file", values.image);
    }

    const res = await fetch("http://localhost:4000/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Error al crear producto");
    const product = await res.json();

    mutate();
    alert("✅ Producto creado con éxito");
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Hubo un problema al crear el producto");
  }
}


  return (
    <ProductForm
      onSubmit={handleCreate}
    />
  );
}
