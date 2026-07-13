"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function ProtectedAdminLayout({
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
    redirect("/admin/login");
  }

  // Verificar que es admin
  if (userRole.role !== "admin") {
    redirect("/portal");
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <AdminSidebar
        userName={userRole?.name ?? "Administrador"}
        userRole={userRole?.role ?? "editor"}
      />
      <main className="flex-1 overflow-x-hidden px-6 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
