import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

// Página de inicio propia de cada rol dentro del panel. Se usa como
// destino por defecto cuando requireRole() bloquea el acceso a una
// ruta que ese rol no debería ver.
export function roleHomePath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "editor":
      return "/admin/settings";
    case "asesor":
      return "/admin/my-appointments";
    case "recepcion":
      return "/admin/appointments";
    case "viewer":
      return "/portal";
    default:
      return "/admin/login";
  }
}

// Guard de servidor para páginas del panel que no todos los roles
// deben ver. Cada rol tiene un alcance acotado (ver comentarios del
// enum user_role en supabase/schema.sql), así que esto es una capa
// extra sobre las políticas RLS, que ya bloquean la lectura/escritura
// de esos datos a nivel de base de datos.
export async function requireRole(allowedRoles: UserRole[], redirectTo?: string) {
  // TODO: Implement Firebase role check
  // const supabase = createClient();

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) {
  //   redirect("/admin/login");
  // }

  // const { data: profile } = await supabase
  //   .from("users")
  //   .select("role")
  //   .eq("id", session.user.id)
  //   .single();

  // const role = (profile?.role ?? "viewer") as UserRole;

  // // El rol "viewer" es el cliente del portal público: nunca pertenece
  // // al panel administrativo, sin importar qué ruta haya pedido.
  // if (role === "viewer") {
  //   redirect("/portal");
  // }

  // if (!