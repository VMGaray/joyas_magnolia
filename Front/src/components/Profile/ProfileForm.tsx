"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, Check } from "lucide-react";
import type { UserData } from "./ProfileDashboard";

interface ProfileFormProps {
  userData: UserData | null;
  onSaved: (data: UserData) => void;
}

export const ProfileForm = ({ userData, onSaved }: ProfileFormProps) => {
  const [form, setForm] = useState<UserData>({
    username: userData?.username || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof UserData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      // Si tu backend expone otra ruta, ajusta el endpoint:
      // Ej: PUT http://localhost:4000/auth/profile
      const res = await fetch("http://localhost:4000/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        throw new Error(serverError || "No se pudo guardar los cambios.");
      }

      onSaved(form);
      setMessage("Datos actualizados correctamente.");
    } catch (err: any) {
      setError(err?.message || "Error inesperado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="font-serif text-2xl text-gray-900 mb-6 border-b border-gray-100 pb-4">Mis Datos Personales</h3>

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

      <form onSubmit={handleSave} className="space-y-6 max-w-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Nombre Completo</label>
            <input
              type="text"
              value={form.username || ""}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={form.email || ""}
                disabled
                className="w-full border border-gray-200 bg-gray-50 pl-10 pr-3 py-2.5 rounded-md text-gray-500 outline-none cursor-not-allowed text-sm"
              />
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Teléfono</label>
          <div className="relative">
            <input
              type="tel"
              value={form.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+54 9 ..."
              className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
            />
            <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Dirección de Envío</label>
          <div className="relative mb-3">
            <input
              type="text"
              value={form.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Calle, Número, Depto"
              className="w-full border border-gray-300 pl-10 pr-3 py-2.5 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
            />
            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ciudad"
              className="w-full border border-gray-300 p-2.5 rounded-md outline-none text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Código Postal"
              className="w-full border border-gray-300 p-2.5 rounded-md outline-none text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-purple-700 transition-all font-bold rounded-md shadow-md hover:shadow-lg disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
};
