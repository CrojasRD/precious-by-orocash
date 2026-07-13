import { requireRole } from "@/lib/auth/require-role";
import UsersTable from "@/components/admin/UsersTable";
import { db } from "@/lib/firebase/admin-config";
import type { AppUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireRole(["admin"]);

  let data: AppUser[] = [];

  try {
    // Fetch all users from Firestore
    try {
      const usersSnapshot = await db().collection("users").get();

      if (usersSnapshot.empty) {
        console.log("No users found in Firestore");
        data = [];
      } else {
        data = usersSnapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            id: doc.id,
            name: userData.name || "",
            email: userData.email || "",
            role: userData.role || "viewer",
            created_at: userData.createdAt || userData.created_at || "",
          };
        }) as AppUser[];
      }
    } catch (firestoreError) {
      console.error("Firestore error fetching users:", firestoreError);
      data = [];
    }
  } catch (error) {
    console.error("Error in users page:", error);
    data = [];
  }

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
