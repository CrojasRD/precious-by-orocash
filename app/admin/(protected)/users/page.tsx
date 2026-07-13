import { db } from "@/lib/firebase/admin-config";
import type { AppUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let data: AppUser[] = [];

  try {
    const usersSnapshot = await db().collection("users").get();

    if (!usersSnapshot.empty) {
      data = usersSnapshot.docs.map((doc) => {
        const userData = doc.data();
        return {
          id: doc.id,
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "viewer",
          created_at: userData.createdAt || userData.created_at || new Date().toISOString(),
        } as AppUser;
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Usuarios activos</p>
        <h1 className="mt-2 font-serif text-3xl text-navy">
          Gestión de usuarios
        </h1>
        <p className="mt-2 max-w-xl text-sm text-navy/60">
          Total de usuarios en el sistema.
        </p>
      </div>

      <div className="overflow-x-auto rounded-sm border border-navy/10 bg-cream shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-widest2 text-navy/50">
              <th className="px-4 py-4">Nombre</th>
              <th className="px-4 py-4">Correo</th>
              <th className="px-4 py-4">Rol</th>
              <th className="px-4 py-4">Fecha de creación</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user) => (
                <tr key={user.id} className="border-b border-navy/5 hover:bg-ivory">
                  <td className="px-4 py-4 font-medium text-navy">{user.name}</td>
                  <td className="px-4 py-4 text-navy/70">{user.email}</td>
                  <td className="px-4 py-4">
                    <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-navy/60">
                    {user.created_at && user.created_at !== "Invalid Date"
                      ? (() => {
                          try {
                            const date = new Date(user.created_at);
                            return isNaN(date.getTime())
                              ? "—"
                              : date.toLocaleDateString("es-EC");
                          } catch {
                            return "—";
                          }
                        })()
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-navy/40">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
