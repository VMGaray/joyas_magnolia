"use client";

import { useState } from "react";
import { Lock, Loader2, Check, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Usamos la URL de la API de forma dinámica
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const SecuritySettings = () => {
  const { user, token } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!current || !next) {
      setError("Por favor, completa ambos campos.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      // Usamos la variable API_URL
      const res = await fetch(`${API_URL}/auth/change-password/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        const serverError = Array.isArray(data.message) ? data.message.join(", ") : data.message;
        throw new Error(serverError || "La contraseña actual es incorrecta.");
      }

      setMessage("Contraseña actualizada con éxito.");
      setCurrent("");
      setNext("");
      
      // Limpiar mensaje de éxito después de unos segundos
      setTimeout(() => setMessage(null), 4000);

    } catch (err: any) {
      setError(err?.message || "Hubo un problema al intentar cambiar la clave.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="font-serif text-2xl text-magnolia-dark mb-6 border-b border-gray-100 pb-4">
        Seguridad de la Cuenta
      </h3>

      {message && (
        <div className="mb-6 flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 px-4 py-3 rounded-sm shadow-sm text-sm">
          <Check size={16} /> {message}
        </div>
      )}
      
      {error && (
        <div className="mb-6 flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-sm shadow-sm text-sm">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-sm focus:border-magnolia-dark focus:ring-0 outline-none text-sm transition-colors"
              placeholder="••••••••"
            />
            <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-sm focus:border-magnolia-dark focus:ring-0 outline-none text-sm transition-colors"
              placeholder="••••••••"
            />
            <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-magnolia-dark text-white px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-magnolia-lilac transition-all font-bold rounded-sm disabled:opacity-60 flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : "Guardar Nueva Clave"}
        </button>
      </form>
    </div>
  );
};