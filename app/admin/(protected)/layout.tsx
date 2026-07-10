import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Segunda barrera de seguridad además del middleware: si por algún
  // motivo no hay sesión, nunca se renderiza contenido del panel.
  if (!session) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("name, email, role")
    .eq("id", session.user.id)
    .single();

  // El rol "viewer" es el cliente del portal público: nunca pertenece
  // al panel administrativo.
  if (profile?.role === "viewer") {
    redirect("/portal");
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <AdminSidebar
        userName={profile?.name ?? session.user.email ?? "Administrador"}
        userRole={profile?.role ?? "editor"}
      />
      <main className="flex-1 overflow-x-hidden px-6 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
