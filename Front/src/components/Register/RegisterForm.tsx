"use client";

import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const router = useRouter(); // Para redirigir al login después de registrarse
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Función que actualiza el estado cuando escribes en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función que envía los datos al Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError("");
    setLoading(true);

    // 1. Validar que las contraseñas coincidan antes de enviar nada
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    // 2. OPCIÓN 1: Concatenar Nombre y Apellido para cumplir con Swagger
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,       // <-- Aquí va unido
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ocurrió un error al registrarse");
      }

      // 3. Éxito: Avisar y mandar al Login
      alert("¡Cuenta creada con éxito! Ahora iniciá sesión.");
      router.push("/ingresar");

    } catch (err: any) {
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

        {/* Mensaje de Error (si existe) */}
        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs rounded-sm border border-red-100 text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Nombre</label>
                <div className="relative">
                    <input 
                        type="text" 
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" 
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Apellido</label>
                <input 
                    type="text" 
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" 
                />
              </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email</label>
            <div className="relative">
                <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" 
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Contraseña</label>
            <div className="relative">
                <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" 
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Repetir Contraseña</label>
            <div className="relative">
                <input 
                    type="password" 
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" 
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-magnolia-dark text-white py-3 uppercase tracking-widest text-sm hover:bg-magnolia-lilac transition-colors font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={18} />
                    Registrando...
                </>
            ) : (
                <>
                    Registrarme
                    <ArrowRight size={16} />
                </>
            )}
          </button>

        </form>

        <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
                ¿Ya tenés cuenta?{" "}
                <Link href="/ingresar" className="text-magnolia-lilac font-bold hover:underline">
                    Ingresar
                </Link>
            </p>
        </div>

    </div>
  );
};