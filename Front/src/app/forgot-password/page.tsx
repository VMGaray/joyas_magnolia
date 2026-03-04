"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("No pudimos encontrar una cuenta con ese email.");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-sm text-center">
          <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="font-serif text-2xl text-magnolia-dark mb-2">¡Email enviado!</h2>
          <p className="text-gray-600 mb-8">
            Si existe una cuenta asociada a <strong>{email}</strong>, recibirás instrucciones para restablecer tu clave en unos minutos.
          </p>
          <Link href="/login" className="text-magnolia-dark font-bold underline hover:text-magnolia-lilac transition-colors">
            Volver al inicio de sesión
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-sm">
        <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-magnolia-dark mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Volver
        </Link>
        
        <h1 className="font-serif text-3xl text-magnolia-dark mb-2">Recuperar clave</h1>
        <p className="text-gray-500 text-sm mb-8">
          Ingresá tu correo electrónico y te enviaremos un link para que puedas generar una nueva contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-sm focus:border-magnolia-dark outline-none text-sm"
                placeholder="tu@email.com"
              />
              <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          {error && <p className="text-red-600 text-xs italic">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-magnolia-dark text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-magnolia-lilac transition-all font-bold rounded-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Enviar instrucciones"}
          </button>
        </form>
      </div>
    </main>
  );
}