"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_CONFIG } from "@/lib/firebase/config";
import { sendPasswordReset } from "@/lib/actions/users";

export default function PortalLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const app = initializeApp(FIREBASE_CONFIG);
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoading(false);
      setError("Correo o contraseña incorrectos.");
      return;
    }

    setLoading(false);

    const next = searchParams.get("next") || "/portal";
    router.push(next);
    router.refresh();
  };

  const handleReset = async () => {
    if (!email) {
      setError("Ingresa tu correo para recuperar el acceso.");
      return;
    }
    setError(null);
    try {
      await sendPasswordReset(email);
      setResetSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el correo.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-serif text-2xl text-cream">PRECIOUS</p>
          <p className="text-xs uppercase tracking-widest2 text-gold-light">
            Portal del cliente
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-sm border border-cream/10 bg-cream/[0.03] p-8 backdrop-blur"
        >
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-light/30">
            <Lock className="h-5 w-5 text-gold-light" strokeWidth={1.25} />
          </div>

          <label className="mb-2 block text-xs uppercase tracking-widest2 text-cream/60">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-5 w-full rounded-sm border border-cream/15 bg-transparent px-4 py-3 text-sm text-cream outline-none focus:border-gold-light"
            placeholder="nombre@correo.com"
          />

          <label className="mb-2 block text-xs uppercase tracking-widest2 text-cream/60">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-sm border border-cream/15 bg-transparent px-4 py-3 text-sm text-cream outline-none focus:border-gold-light"
            placeholder="••••••••"
          />

          {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
          {resetSent && (
            <p className="mb-4 text-sm text-emerald-400">
              Te enviamos un correo para restablecer tu contraseña.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold-dark py-3 text-sm uppercase tracking-widest2 text-navy transition-colors hover:bg-gold-light disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="mt-4 w-full text-center text-xs uppercase tracking-widest2 text-cream/50 hover:text-gold-light"
          >
            Recuperar acceso
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-cream/40">
          Acceso exclusivo para clientes con cita registrada en Precious by Orocash.
        </p>
      </div>
    </div>
  );
}
