"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { notifyError } from "@/components/helpers/Toast";
import { WelcomeModal } from "./WelcomeModal";

export const LoginForm = () => {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [adminCode, setAdminCode] = useState("");

  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

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
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();
      let data: any = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        // Si no es JSON, manejamos el texto plano
      }

      // 🛡️ DETECCIÓN DE USUARIO BLOQUEADO (Senior UX)
      // Chequeamos status 403 o si el mensaje del servidor menciona bloqueo
      if (response.status === 403 || data.message?.toLowerCase().includes("block")) {
        const msgBloqueo = "El usuario está bloqueado. Por favor, comunicarse con Magnoliajoyas7@gmail.com";
        setError(msgBloqueo);
        notifyError("Cuenta suspendida 🔒");
        setLoading(false);
        return;
      }

      if (response.ok && data?.requires2FA) {
        setStep(2);
        setLoading(false);
        return;
      }

      let token: string | null = data?.token || data?.access_token || null;

      if (!token && response.ok && responseText.length > 100) {
        token = responseText;
      }

      if (!response.ok || !token) {
        throw new Error(data.message || "Credenciales inválidas");
      }

      const cleanToken = token.replace(/^"|"$/g, "");
      
      await login(cleanToken);
      await new Promise(resolve => setTimeout(resolve, 300));

      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser?.isAdmin) {
        setWelcomeMessage("Ingreso exitoso ✨");
        setUserName(parsedUser.username || "Admin");
        setTimeout(() => {
          window.location.replace("/admin");
        }, 1500);
      } else {
        setWelcomeMessage("Ingreso exitoso 🛍️");
        setUserName(parsedUser.username || "Usuario");
        setTimeout(() => {
          window.location.replace("/");
        }, 1500);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message);
      notifyError("Credenciales inválidas ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/auth/verify-admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: adminCode }),
      });

      const responseText = await response.text();
      let data: any = {};
      try { data = JSON.parse(responseText); } catch {}

      if (!response.ok) {
        throw new Error(data.message || "Código inválido");
      }

      const token = data?.token || data?.access_token || responseText;
      const cleanToken = token.replace(/^"|"$/g, "");
      
      await login(cleanToken);
      await new Promise(resolve => setTimeout(resolve, 300));

      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      setWelcomeMessage("Ingreso Administrador Exitoso ✨");
      setUserName(parsedUser?.username || "Admin");
      
      setTimeout(() => {
        window.location.replace("/admin");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      notifyError("Error al verificar código ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md p-8 rounded-sm shadow-sm border border-gray-100 font-sans">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-magnolia-dark mb-2">Bienvenida</h1>
        <p className="text-sm text-gray-500">Ingresá a tu cuenta para ver tus pedidos</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-[11px] leading-relaxed rounded-sm border border-red-100 text-center font-bold">
          {error}
        </div>
      )}

      {step === 1 ? (
      <>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Email</label>
          <div className="relative">
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com" 
              className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac transition-colors text-sm"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold">Contraseña</label>
            <Link href="/recuperar-clave" className="text-[10px] uppercase tracking-tighter text-magnolia-lilac hover:underline font-bold">
              ¿Olvidaste tu clave?
            </Link>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••" 
              className="w-full border border-gray-300 pl-10 pr-10 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac transition-colors text-sm"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-magnolia-dark text-white py-4 uppercase tracking-[0.2em] text-xs hover:bg-magnolia-lilac transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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

      <div className="my-8 flex items-center gap-4">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-[10px] text-gray-400 uppercase font-bold">O</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4 font-sans">¿Todavía no tenés cuenta?</p>
        <Link 
          href="/registro" 
          className="block w-full border border-magnolia-dark text-magnolia-dark py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-magnolia-dark hover:text-white transition-colors"
        >
          Crear Cuenta
        </Link>
        </div>
      </>
      ) : (
        <form onSubmit={handleVerifyAdmin} className="space-y-6">
          <p className="text-gray-600 text-sm text-center mb-4">
            Ingresa el código de seguridad que enviamos a tu correo de administrador.
          </p>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold text-center">Código 2FA</label>
            <div className="relative">
              <input 
                type="text" 
                maxLength={6}
                required
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="123456" 
                className="w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-magnolia-lilac transition-colors text-center tracking-[0.5em] font-mono text-lg"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-magnolia-dark text-white py-4 uppercase tracking-[0.2em] text-xs hover:bg-magnolia-lilac transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Verificar y Entrar <ArrowRight size={16} /></>}
          </button>
          
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full border border-gray-300 text-gray-600 py-3 uppercase tracking-widest text-xs font-bold hover:bg-gray-50 transition-colors mt-2"
          >
            Volver
          </button>
        </form>
      )}

      {welcomeMessage && (
        <WelcomeModal
          message={welcomeMessage}
          name={userName}
          onClose={() => setWelcomeMessage(null)}
        />
      )}
    </div>
  );
};