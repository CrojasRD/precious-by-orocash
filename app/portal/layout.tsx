"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole, loading } = useAuth();

  // Mostrar cargando mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy">
        <div className="text-center">
          <p className="text-cream">Cargando...</p>
        </div>
      </div>
    );
  }

  // Verificar que está autenticado
  if (!userRole) {
    redirect("/portal/login");
  }

  // Permitir viewer y admin (admin puede acceder a portal también)
  if (userRole.role !== "viewer" && userRole.role !== "admin") {
    redirect("/portal/login");
  }

  return children;
}
