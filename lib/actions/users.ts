"use server";

import { revalidatePath } from "next/cache";
import type { UserRole } from "@/lib/types";

// Todas las acciones de esta gestión de usuarios verifican primero
// que quien la ejecuta es realmente "admin". Solo después realizan
// las operaciones que requieren privilegios de administrador
// (crear/invitar/borrar usuarios).
async function assertAdmin() {
  // TODO: Implement Firebase admin check
  // const supabase = createClient();
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // if (!session) throw new Error("No autorizado.");

  // const { data: profile } = await supabase
  //   .from("users")
  //   .select("role")
  //   .eq("id", session.user.id)
  //   .single();

  // if (profile?.role !== "admin") {
  //   throw new Error("Solo un administrador puede gestionar usuarios.");
  // }
}

// Crea el usuario y le envía un correo de invitación
// para que establezca su propia contraseña.
export async function inviteUser(input: { name: string; email: string; role: UserRole }) {
  // TODO: Implement Firebase user invitation
  await assertAdmin();

  if (!input.name.trim()) throw new Error("Ingresa el nombre del usuario.");
  if (!input.email.trim()) throw new Error("Ingresa el correo del usuario.");

  // const service = createServiceClient();
  // const { error } = await service.auth.admin.inviteUserByEmail(input.email.trim(), {
  //   data: { name: input.name.trim(), role: input.role },
  // });

  // if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function updateUserRole(userId: string, role: UserRole) {
  // TODO: Implement Firebase user role update
  await assertAdmin();

  // const service = createServiceClient();
  // const { error } = await service.from("users").update({ role }).eq("id", userId);
  // if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

// Elimina el usuario y sus datos asociados.
export async function deleteUser(userId: string) {
  // TODO: Implement Firebase user deletion
  await assertAdmin();

  // const service = createServiceClient();
  // const { error } = await service.auth.admin.deleteUser(userId);
  // if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

// "Recuperar acceso": reenvía un correo de restablecimiento de
// contraseña. No requiere privilegios de admin — cualquiera puede
// pedirlo desde /admin/login — pero también se expone en /admin/users
// para que un admin lo dispare 