"use client";

import { useState } from "react";
import { Mail, Key, Lock, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notifySuccess, notifyError } from "@/components/helpers/Toast";

enum Step { EMAIL, CODE, NEW_PASSWORD, SUCCESS }

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const ForgotPassword = () => {
  const [step, setStep] = useState<Step>(Step.EMAIL);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [passwords, setPasswords] = useState({ password: "", password2: "" });

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("No pudimos enviar el correo. Verificá tu email.");
      notifySuccess("Código enviado a tu email 📧");
      setStep(Step.CODE);
    } catch (err: any) {
      notifyError(err.message);
    } finally { setLoading(false); }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) throw new Error("Código inválido o expirado");
      notifySuccess("Código verificado con éxito ✨");
      setStep(Step.NEW_PASSWORD);
    } catch (err: any) {
      notifyError(err.message);
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.password !== passwords.password2) return notifyError("Las claves no coinciden");
    
    setLoading(true);
    try {
      // ✅ AJUSTE SEGÚN SWAGGER: Enviamos email, code, password y password2
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code, // Es vital enviar el código también aquí
          password: passwords.password, 
          password2: passwords.password2 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "No se pudo restablecer la clave");
      }

      setStep(Step.SUCCESS);
      notifySuccess("¡Contraseña actualizada! 🛍️");
    } catch (err: any) {
      notifyError(err.message);
    } finally { setLoading(false); }
  };

  if (step === Step.SUCCESS) {
    return (
      <div className="text-center p-8 bg-white shadow-sm border border-gray-100 rounded-sm">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
        <h2 className="font-serif text-2xl text-magnolia-dark mb-2">¡Todo listo!</h2>
        <p className="text-sm text-gray-500 mb-6">Tu contraseña ha sido actualizada correctamente.</p>
        <Link href="/login" className="block w-full bg-magnolia-dark text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-magnolia-lilac transition-colors">
          Ir al Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white w-full max-w-md p-8 rounded-sm shadow-sm border border-gray-100">
      <Link href="/login" className="flex items-center gap-2 text-xs text-gray-400 mb-6 hover:text-magnolia-lilac transition-colors">
        <ArrowLeft size={14} /> Volver
      </Link>

      <h1 className="font-serif text-2xl text-magnolia-dark mb-2">
        {step === Step.EMAIL && "Recuperar cuenta"}
        {step === Step.CODE && "Verificar código"}
        {step === Step.NEW_PASSWORD && "Nueva contraseña"}
      </h1>
      
      <p className="text-xs text-gray-500 mb-8 font-sans">
        {step === Step.EMAIL && "Ingresá tu email para recibir un código de acceso."}
        {step === Step.CODE && "Ingresá el código de 6 dígitos que enviamos a tu mail."}
        {step === Step.NEW_PASSWORD && "Elegí una nueva clave para tu cuenta de Magnolia."}
      </p>

      <form 
        onSubmit={
          step === Step.EMAIL ? handleSendEmail : 
          step === Step.CODE ? handleVerifyCode : 
          handleResetPassword
        } 
        className="space-y-6"
      >
        {step === Step.EMAIL && (
          <div className="relative font-sans">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-magnolia-lilac outline-none transition-colors" placeholder="tu@email.com" />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        )}

        {step === Step.CODE && (
          <div className="relative font-sans">
            <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} className="w-full border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-magnolia-lilac outline-none tracking-[1em] font-bold transition-colors text-center" placeholder="000000" maxLength={6} />
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        )}

        {step === Step.NEW_PASSWORD && (
          <>
            <div className="relative font-sans">
              <input type="password" required value={passwords.password} onChange={(e) => setPasswords({...passwords, password: e.target.value})} className="w-full border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-magnolia-lilac outline-none transition-colors" placeholder="Nueva contraseña" />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="relative font-sans">
              <input type="password" required value={passwords.password2} onChange={(e) => setPasswords({...passwords, password2: e.target.value})} className="w-full border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-magnolia-lilac outline-none transition-colors" placeholder="Confirmar contraseña" />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="w-full bg-magnolia-dark text-white py-3 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 hover:bg-magnolia-lilac transition-all disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Continuar"}
        </button>
      </form>
    </div>
  );
};