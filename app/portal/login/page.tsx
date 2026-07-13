"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { sendPasswordReset } from "@/lib/actions/users";

function PortalLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    // Limpiar cualquier dato guardado en storage
    localStorage.clear();
    sessionStorage.clear();

    // Verificar si ya hay una sesión activa
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuario ya autenticado, verificar rol
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));

          const response = await fetch(`/api/auth/verify-role?uid=${user.uid}`);
          if (response.ok) {
            const data = await response.json();
            if (data.role === "admin") {
              // Es admin, redirigir al panel de admin
              router.push("/admin/dashboard");
              return;
            } else {
              // Es cliente, ir al portal
              const next = searchParams.get("next") || "/portal";
              router.push(next);
              return;
            }
          }
        } catch (err) {
          console.error("Error verifying role:", err);
        }
      }
    });

    return unsubscribe;
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email.trim()) {
        throw new Error("Ingresa tu correo electrónico");
      }
      if (!password) {
        throw new Error("Ingresa tu contraseña");
      }

      // Autenticar con Firebase
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Obtener token de sesión
      const token = await result.user.getIdToken();

      // Crear cookie de sesión
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          uid: result.user.uid,
          email: result.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear sesión");
      }

      // Esperar a que se actualice Firestore
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Verificar el rol del usuario
      const roleResponse = await fetch(`/api/auth/verify-role?uid=${result.user.uid}`);
      if (!roleResponse.ok) {
        throw new Error("Error al verificar acceso");
      }

      const roleData = await roleResponse.json();

      // Permitir acceso a clientes (viewer) y admins
      if (roleData.role !== "viewer" && roleData.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST" });
        setError("Acceso denegado. Contacta al administrador.");
        setLoading(false);
        return;
      }

      // Actualizar último login
      await fetch("/api/auth/update-last-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: result.user.uid }),
      });

      // Limpiar los campos antes de redirigir
      setEmail("");
      setPassword("");

      // Redirigir al portal
      const next = searchParams.get("next") || "/portal";
      router.push(next);
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.message || "Correo o contraseña incorrectos";

      // Mapear errores de Firebase a mensajes en español
      if (err.code === "auth/user-not-found") {
        setError("Usuario no registrado");
      } else if (err.code === "auth/wrong-password") {
        setError("Contraseña incorrecta");
      } else if (err.code === "auth/invalid-email") {
        setError("Correo electrónico inválido");
      } else if (err.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Intenta más tarde.");
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Ingresa tu correo para recuperar el acceso.");
      return;
    }
    setError(null);
    try {
      const result = await sendPasswordReset(email);
      if (result.success) {
        setResetSent(true);
        setTimeout(() => setResetSent(false), 5000);
      } else {
        setError(result.error || "No se pudo enviar el correo.");
      }
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
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mb-5 w-full rounded-sm border border-cream/15 bg-transparent px-4 py-3 text-sm text-cream outline-none focus:border-gold-light disabled:opacity-50"
            placeholder="correo@ejemplo.com"
          />

          <label className="mb-2 block text-xs uppercase tracking-widest2 text-cream/60">
            Contraseña
          </label>
          <input
            type="password"
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="mb-6 w-full rounded-sm border border-cream/15 bg-transparent px-4 py-3 text-sm text-cream outline-none focus:border-gold-light disabled:opacity-50"
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
            disabled={loading}
            className="mt-4 w-full text-center text-xs uppercase tracking-widest2 text-cream/50 hover:text-gold-light disabled:opacity-50"
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

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-navy">Cargando...</div>}>
      <PortalLoginContent />
    </Suspense>
  );
}
