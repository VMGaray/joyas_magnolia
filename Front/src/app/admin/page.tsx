'use client';

import CrearProducto from "@/components/Admin/CrearProducto";
import ListaProductos from "@/components/Admin/ListaProductos";
import ListaPedidos from "@/components/Admin/ListaPedidos";

export default function AdminPage() {
  // Ejemplo de métricas dummy, después las traés del backend
  const metrics = [
    { title: "Productos", value: 120, color: "bg-blue-500" },
    { title: "Stock total", value: 450, color: "bg-green-500" },
    { title: "Pedidos", value: 35, color: "bg-purple-500" },
    { title: "Usuarios", value: 12, color: "bg-pink-500" },
  ];

  return (
    <div className="p-6 space-y-12">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div
            key={m.title}
            className={`${m.color} text-white rounded-lg shadow p-6 flex flex-col items-center`}
          >
            <span className="text-lg font-semibold">{m.title}</span>
            <span className="text-2xl font-bold">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Gestión de productos */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-700">Gestión de Productos</h2>
        <CrearProducto />
        <ListaProductos />
      </section>

      {/* Pedidos (cuando lo tengas) */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-700">Pedidos</h2>
        <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-700">Pedidos</h2>
        <ListaPedidos />
        </section>
        <p className="text-gray-500">Próximamente: listado de pedidos</p>
      </section>
    </div>
  );
}
