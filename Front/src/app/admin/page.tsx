'use client';

import CrearProducto from "@/components/Admin/CrearProducto";
import ListaProductos from "@/components/Admin/ListaProductos";
import ListaPedidos from "@/components/Admin/ListaPedidos";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

export default function AdminPage() {
  const metrics = [
    { title: "Productos", value: 120, color: "bg-blue-500" },
    { title: "Stock total", value: 450, color: "bg-green-500" },
    { title: "Pedidos", value: 35, color: "bg-purple-500" },
    { title: "Usuarios", value: 12, color: "bg-pink-500" },
  ];

  // Datos mockeados para gráficos
  const ventasPorMes = [
    { mes: "Enero", total: 12000 },
    { mes: "Febrero", total: 8500 },
    { mes: "Marzo", total: 15000 },
    { mes: "Abril", total: 11000 },
  ];
  const pedidosPorEstado = [
    { estado: "Pendiente", cantidad: 12 },
    { estado: "Procesado", cantidad: 8 },
    { estado: "Enviado", cantidad: 15 },
    { estado: "Cancelado", cantidad: 3 },
  ];

const magnoliaColors = {
  dark: "#3B1C5A",    // Violeta profundo, base corporativa
  lilac: "#A78BFA",   // Lila suave, elegante y moderno
  accent: "#E9D5FF",  // Lila pastel claro para fondos o detalles
  gold: "#D4AF37",    // Dorado joyería, acento premium
  success: "#22C55E", // Verde Tailwind (para estados positivos)
  danger: "#EF4444",  // Rojo Tailwind (para errores/cancelados)
};


  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>

      {/* Métricas rápidas */}
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

      {/* Gráficos */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-magnolia-dark">Métricas visuales</h2>

        {/* Ventas por mes */}
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-lg font-semibold text-magnolia-dark mb-4">Ventas por mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke={magnoliaColors.lilac} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pedidos por estado */}
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-lg font-semibold text-magnolia-dark mb-4">Pedidos por estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pedidosPorEstado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="estado" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill={magnoliaColors.lilac} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Gestión de productos */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-700">Gestión de Productos</h2>
        <CrearProducto />
        <ListaProductos />
      </section>

      {/* Pedidos */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-700">Pedidos</h2>
        <ListaPedidos />
      </section>
    </div>
  );
}
