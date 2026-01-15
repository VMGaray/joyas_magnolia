"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // <--- 1. IMPORTAMOS EL CONTEXTO

export const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth(); // <--- 2. TRAEMOS LA FUNCIÓN LOGIN
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

  try {
    console.log("Login payload:", formData);

    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const responseText = await response.text();
    console.log("Raw login response:", responseText);

    let token: string | null = null;

    try {
      const data = JSON.parse(responseText);
      token = data?.token || data?.access_token || null;
    } catch {
      // Si no es JSON, asumimos que el texto plano es el token
      if (response.ok && responseText.length > 100) {
        token = responseText;
      } else {
        console.warn("No se pudo parsear la respuesta como JSON");
        token = null;
      }
    }

    if (!response.ok || !token) {
      throw new Error("Credenciales inválidas");
    }

    login(token.replace(/^"|"$/g, ""));
    router.push("/perfil");
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
        <h1 className="font-serif text-3xl text-magnolia-dark mb-2">Bienvenida</h1>
        <p className="text-sm text-gray-500 font-sans">Ingresá a tu cuenta para ver tus pedidos</p>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs rounded-sm border border-red-100 text-center">
            {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email</label>
          <div className="relative">
              <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com" 
                  className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac transition-colors"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <div className="flex justify-between items-center mb-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500">Contraseña</label>
              <Link href="#" className="text-xs text-magnolia-lilac hover:underline">¿Olvidaste tu clave?</Link>
          </div>
          <div className="relative">
              <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••" 
                  className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac transition-colors"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Botón Ingresar */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-magnolia-dark text-white py-3 uppercase tracking-widest text-sm hover:bg-magnolia-lilac transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
             <>
               <Loader2 className="animate-spin" size={18} />
               Ingresando...
             </>
          ) : (
             <>
               Ingresar
               <ArrowRight size={16} />
             </>
          )}
        </button>
      </form>

      {/* Separador */}
      <div className="my-8 flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs text-gray-400 uppercase">O</span>
          <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      {/* Link a Registro */}
      <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">¿Todavía no tenés cuenta?</p>
          <Link 
              href="/registro" 
              className="block w-full border border-magnolia-dark text-magnolia-dark py-3 uppercase tracking-widest text-xs hover:bg-magnolia-dark hover:text-white transition-colors"
          >
              Crear Cuenta
          </Link>
      </div>

    </div>
  );
};
