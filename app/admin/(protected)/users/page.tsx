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

      <div className="overflow-x-auto rounded-sm border border-navy/10 bg-cream shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-widest2 text-navy/50">
              <th className="px-4 py-4">Nombre</th>
              <th className="px-4 py-4">Correo</th>
              <th className="px-4 py-4">Rol</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-navy/5">
              <td className="px-4 py-4 font-medium text-navy">Editor</td>
              <td className="px-4 py-4 text-navy/70">editor@preciousbyorocash.com</td>
              <td className="px-4 py-4">
                <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
                  editor
                </span>
              </td>
            </tr>
            <tr className="border-b border-navy/5">
              <td className="px-4 py-4 font-medium text-navy">Admin</td>
              <td className="px-4 py-4 text-navy/70">admin@preciousbyorocash.com</td>
              <td className="px-4 py-4">
                <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
                  admin
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
