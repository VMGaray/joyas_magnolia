"use client";

import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Loader2, Phone } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: fullName,
          email: formData.email,
          password: formData.password,
          password2: formData.confirmPassword,
          phone: Number(formData.phone),
          address: "Dirección no especificada"
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }

      if (!response.ok) {
        const serverError = Array.isArray(data.message) ? data.message.join(", ") : data.message;
        throw new Error(serverError || "Ocurrió un error al registrarse");
      }

      alert("¡Cuenta creada con éxito! Ahora iniciá sesión.");
      router.push("/login"); // ✅ corregido

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md p-8 rounded-sm shadow-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-magnolia-dark mb-2">Crear Cuenta</h1>
          <p className="text-sm text-gray-500 font-sans">Sumate a Magnolia y disfrutá beneficios exclusivos</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs rounded-sm border border-red-100 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Nombre</label>
                <div className="relative">
                    <input 
                        type="text" name="firstName" required
                        value={formData.firstName} onChange={handleChange}
                        className="w-full border border-gray-300 pl-8 pr-2 py-2 rounded-sm focus:outline-none focus:border-magnolia-lilac text-sm" 
                    />
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Apellido</label>
                <input 
                    type="text" name="lastName" required
                    value={formData.lastName} onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:border-magnolia-lilac text-sm" 
                />
              </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Teléfono</label>
            <div className="relative">
                <input 
                    type="number" name="phone" required placeholder="Ej: 1112345678"
                    value={formData.phone} onChange={handleChange}
                    className="w-full border border-gray-300 pl-8 pr-4 py-2 rounded-sm focus:outline-none focus:border-magnolia-lilac text-sm" 
                />
                <Phone className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</label>
            <div className="relative">
                <input 
                    type="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    className="w-full border border-gray-300 pl-8 pr-4 py-2 rounded-sm focus:outline-none focus:border-magnolia-lilac text-sm" 
                />
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Contraseña</label>
            <div className="relative">
                <input 
                    type="password" name="password" required placeholder="Mínimo 8 caracteres, Mayúscula y símbolo"
                    value={formData.password} onChange={handleChange}
                    className="w-full border border-gray-300 pl-8 pr-4 py-2 rounded-sm focus:outline-none focus:border-magnolia-lilac text-sm" 
                />
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Repetir Contraseña</label>
            <div className="relative">
                <input 
                    type="password" name="confirmPassword" required
                    value={formData.confirmPassword} onChange={handleChange}
                    className="w-full border border-gray-300 pl-8 pr-4 py-2 rounded-sm focus:outline-none focus:border-magnolia-lilac text-sm" 
                />
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-magnolia-dark text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-magnolia-lilac transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Registrarme <ArrowRight size={16} /></>}
          </button>

        </form>

        <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
                ¿Ya tenés cuenta?{" "}
                <Link href="/login" className="text-magnolia-lilac font-bold hover:underline">Ingresar</Link>
            </p>
        </div>
    </div>
  );
};
