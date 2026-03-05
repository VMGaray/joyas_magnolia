'use client';

import React from 'react';
import { useMetricsSales, useMetricsOrders, useProducts } from "@/lib/hooks"; 
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ResponsiveContainer, YAxis as YAxisBar
} from "recharts";
import { Loader2, DollarSign, Package, AlertTriangle } from "lucide-react";
import ListaPedidos from "@/components/Admin/ListaPedidos";
import ListaProductos from "@/components/Admin/ListaProductos";

export default function AdminPage() {
  const { salesMetrics, isLoading: loadingSales } = useMetricsSales();
  const { ordersMetrics, isLoading: loadingOrders } = useMetricsOrders();
  const { products } = useProducts();

  const magnoliaColors = {
    dark: "#3B1C5A",
    lilac: "#A78BFA",
    accent: "#E9D5FF",
  };

  const validSalesData = Array.isArray(salesMetrics) ? salesMetrics : [];
  const validOrdersData = Array.isArray(ordersMetrics) ? ordersMetrics : [];

  // 💰 Cálculo de ventas reales (x1000)
  const totalVentas = validSalesData.reduce(
    (acc: number, curr: any) => acc + (Number(curr.total || 0) * 1000), 
    0
  );

  // ⚠️ Cálculo de stock bajo
  const stockCriticoCount = Array.isArray(products) 
    ? products.filter((p: any) => p.stock < 5).length 
    : 0;

  return (
    <div className="p-4 md:p-8 space-y-10 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-magnolia-dark">Panel de Control</h1>
          <p className="text-gray-500 text-sm italic">Gestión de Magnolia Joyas.</p>
        </div>
      </header>

      {/* TARJETAS DE RESUMEN (Ahora con 3 columnas para que se vean más grandes y claras) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          title="Ventas Totales" 
          value={`$${totalVentas.toLocaleString("es-AR")}`} 
          icon={<DollarSign className="text-green-600" />} 
        />
        <StatCard 
          title="Pedidos Totales" 
          value={validOrdersData.reduce((acc, curr) => acc + (curr.cantidad || 0), 0)} 
          icon={<Package className="text-blue-600" />} 
        />
        <StatCard 
          title="Stock Crítico" 
          value={stockCriticoCount} 
          icon={<AlertTriangle className={stockCriticoCount > 0 ? "text-red-600 animate-pulse" : "text-gray-400"} />} 
          color={stockCriticoCount > 0 ? "bg-red-50" : "bg-white"} 
        />
      </section>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-serif text-magnolia-dark mb-6">Rendimiento de Ventas</h3>
          <div className="h-[300px]">
            {loadingSales ? <LoadingState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={validSalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{fill: '#9ca3af', fontSize: 11}} />
                  <YAxis tickFormatter={(v) => `$${(v * 1000).toLocaleString()}`} tick={{fill: '#9ca3af', fontSize: 11}} />
                  <Tooltip 
                    formatter={(v: any) => [`$${(Number(v) * 1000).toLocaleString()}`, "Ventas"]}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Line type="monotone" dataKey="total" stroke={magnoliaColors.dark} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-serif text-magnolia-dark mb-6">Estados de Pedidos</h3>
          <div className="h-[300px]">
            {loadingOrders ? <LoadingState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={validOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="estado" tick={{fill: '#9ca3af', fontSize: 11}} />
                  <YAxisBar tick={{fill: '#9ca3af', fontSize: 11}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="cantidad" fill={magnoliaColors.lilac} radius={[6, 6, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* TABLAS DE GESTIÓN */}
      <div className="space-y-16">
        <ListaPedidos />
        <ListaProductos />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "bg-white border-gray-100" }: any) {
  return (
    <div className={`${color} p-6 rounded-2xl shadow-sm border flex items-center justify-between`}>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
      </div>
      <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <Loader2 size={32} className="animate-spin text-magnolia-lilac" />
    </div>
  );
}