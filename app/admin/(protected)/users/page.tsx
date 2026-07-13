import UsersPageClient from "@/components/admin/UsersPageClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Usuarios activos</p>
        <h1 className="mt-2 font-serif text-3xl text-navy">
          Gestión de usuarios
        </h1>
      </div>

      <UsersPageClient />
    </div>
  );
}
