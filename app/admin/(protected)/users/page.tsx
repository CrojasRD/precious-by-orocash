// Firebase imports removed - using empty array as fallback
import { requireRole } from "@/lib/auth/require-role";
import UsersTable from "@/components/admin/UsersTable";
import type { AppUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireRole(["admin"]);
  // TODO: Implement Firestore query for users collection
  // For now, using empty array as fallback
  const data = [] as AppUser[];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Usuarios activos</p>
          <h1 className="mt-2 font-serif text-3xl text-navy">
            Gestión de usuarios y permisos
          </h1>
          <p className="mt-2 max-w-xl text-sm text-navy/60">
            Crea accesos para el equipo, asigna su rol y revoca el acceso
            cuando sea necesario. Cada acción queda registrada.
          </p>
        </div>
      </div>

      <UsersTable initialUsers={(data ?? []) as AppUser[]} />
    </div>
  );
}
