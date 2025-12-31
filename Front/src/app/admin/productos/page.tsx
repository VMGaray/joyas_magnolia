import CrearProducto from "@/components/Admin/CrearProducto";
import ListaProductos from "@/components/Admin/ListaProductos";

export default function Page() {
  return (
    <div className="space-y-12 p-6">
      <CrearProducto />
      <ListaProductos />
    </div>
  );
}
