'use client';

import { useState, useEffect } from "react";
import CrearProducto from "@/components/Admin/CrearProducto";
import ListaProductos from "@/components/Admin/ListaProductos";
import ListaPedidos from "@/components/Admin/ListaPedidos";
import { useMetricsSales, useMetricsOrders } from "@/lib/hooks";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { salesMetrics, isLoading: loadingSales } = useMetricsSales();
  const { ordersMetrics, isLoading: loadingOrders } = useMetricsOrders();

  // Datos formateados para los gráficos
  const ventasPorMes = salesMetrics || [];
  const pedidosPorEstado = ordersMetrics || [];

  const magnoliaColors = {
    dark: "#3B1C5A",
    lilac: "#A78BFA",
    accent: "#E9D5FF",
    gold: "#D4AF37",
    success: "#22C55E",
    danger: "#EF4444",
  };

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>

      {/* Gráficos */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-magnolia-dark">Métricas visuales</h2>

        {/* Ventas por mes */}
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-lg font-semibold text-magnolia-dark mb-4">Ventas por mes</h3>
          {loadingSales ? (
            <div className="flex items-center justify-center h-[300px] gap-2 text-gray-500">
              <Loader2 size={20} className="animate-spin" />
              <span>Cargando datos...</span>
            </div>
          ) : ventasPorMes && ventasPorMes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke={magnoliaColors.lilac} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No hay datos de ventas disponibles
            </div>
          )}
        </div>

        {/* Pedidos por estado */}
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-lg font-semibold text-magnolia-dark mb-4">Pedidos por estado</h3>
          {loadingOrders ? (
            <div className="flex items-center justify-center h-[300px] gap-2 text-gray-500">
              <Loader2 size={20} className="animate-spin" />
              <span>Cargando datos...</span>
            </div>
          ) : pedidosPorEstado && pedidosPorEstado.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pedidosPorEstado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estado" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill={magnoliaColors.lilac} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No hay datos de pedidos disponibles
            </div>
          )}
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
