'use client';

import { useState, useEffect } from "react";
import { UserCircle, Loader2, AlertTriangle } from "lucide-react";
import { notifyError } from "@/components/helpers/Toast";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

useEffect(() => {
  const fetchUsuariosReales = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Intentamos la ruta lógica, aunque sepamos que no está en el Swagger aún
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUsuarios(Array.isArray(data) ? data : data.users || []);
      } else {
        // 🛡️ Si el endpoint no existe (404), limpiamos la lista
        // para que no muestre los datos mockeados de antes
        setUsuarios([]);
        console.warn("El endpoint /admin/users todavía no fue creado por el backend.");
      }
    } catch (err) {
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUsuariosReales();
}, [API_URL]);

  if (loading) return (
    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-magnolia-lilac" size={32} /></div>
  );

  // Si no hay usuarios y hubo error 403 o 404, mostramos un aviso real
  if (usuarios.length === 0) {
    return (
      <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 text-center">
        <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={32} />
        <h3 className="text-gray-700 font-bold">No se pudieron cargar los usuarios</h3>
        <p className="text-gray-400 text-sm mt-2">
          {errorStatus === 403 
            ? "Tu usuario no tiene permisos de Administrador para ver esta lista." 
            : "El endpoint GET /users no parece estar disponible todavía."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        {/* ... (Tu tabla igual que antes pero usando u.role === 'ADMIN' si Andre lo cambió) ... */}
        <tbody className="divide-y divide-gray-50">
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <UserCircle size={20} className="text-gray-300" />
                  <span className="text-sm font-bold text-gray-700">{u.name || u.email.split('@')[0]}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                  (u.isAdmin || u.role === 'ADMIN') ? "bg-magnolia-dark text-white" : "bg-magnolia-lilac/20 text-magnolia-dark"
                }`}>
                  {(u.isAdmin || u.role === 'ADMIN') ? "Administrador" : "Cliente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}