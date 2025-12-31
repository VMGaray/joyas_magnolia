"use client";

import { useState } from "react";
import { Lock, Loader2, Check } from "lucide-react";

export const SecuritySettings = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        throw new Error(serverError || "No se pudo actualizar la contraseña.");
      }

      setMessage("Contraseña actualizada correctamente.");
      setCurrent("");
      setNext("");
    } catch (err: any) {
      setError(err?.message || "Error inesperado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="font-serif text-2xl text-gray-900 mb-6 border-b border-gray-100 pb-4">
        Cambiar Contraseña
      </h3>

      {message && (
        <div className="mb-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded">
          <Check size={16} /> {message}
        </div>
      )}
      {error && (
        <div className="mb-4 text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
        <div>
          <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Contraseña Actual</label>
          <div className="relative">
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
              placeholder="••••••••"
            />
            <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Nueva Contraseña</label>
          <div className="relative">
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
              placeholder="••••••••"
            />
            <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors font-bold rounded-md disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : "Actualizar Clave"}
        </button>
      </form>
    </div>
  );
};
