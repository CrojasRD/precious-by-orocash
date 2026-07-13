"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import {
  USER_ROLE_LABELS,
  USER_ROLE_DESCRIPTIONS,
  type AppUser,
  type UserRole,
} from "@/lib/types";
import { inviteUser, updateUserRole, deleteUser, sendPasswordReset } from "@/lib/actions/users";

const ROLE_OPTIONS: UserRole[] = ["admin", "editor", "asesor", "recepcion", "viewer"];

export default function UsersTable({ initialUsers }: { initialUsers: AppUser[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("recepcion");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        // TODO: Get actual adminUid from auth context
        const adminUid = ""; // Temporary - should come from auth session
        await inviteUser({ name, email, role }, adminUid);
        setSuccess(`Invitación enviada a ${email}.`);
        setName("");
        setEmail("");
        setRole("recepcion");
        setShowForm(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo invitar al usuario.");
      }
    });
  }

  function handleRoleChange(user: AppUser, newRole: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    startTransition(async () => {
      try {
        // TODO: Get actual adminUid from auth context
        const adminUid = "";
        await updateUserRole(user.id, newRole, adminUid);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cambiar el rol.");
        router.refresh();
      }
    });
  }

  function handleDelete(user: AppUser) {
    if (!confirm(`¿Eliminar el acceso de ${user.name}? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      try {
        // TODO: Get actual adminUid from auth context
        const adminUid = "";
        await deleteUser(user.id, adminUid);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo eliminar el usuario.");
      }
    });
  }

  function handleResendAccess(user: AppUser) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await sendPasswordReset(user.email);
        setSuccess(`Correo de recuperación enviado a ${user.email}.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo enviar el correo.");
      }
    });
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary !py-3 text-xs">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Nuevo usuario"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleInvite}
          className="mb-8 grid grid-cols-1 gap-4 rounded-sm border border-gold/30 bg-ivory p-6 sm:grid-cols-3"
        >
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">Nombre</label>
            <input
              type="text"
              required
              className="input-luxe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. David Choez"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">Correo</label>
            <input
              type="email"
              required
              className="input-luxe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@preciousbyorocash.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">Rol</label>
            <select
              className="input-luxe"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>

          <p className="sm:col-span-3 text-xs text-navy/50">{USER_ROLE_DESCRIPTIONS[role]}</p>

          {error && <p className="sm:col-span-3 text-sm text-rose-600">{error}</p>}

          <div className="sm:col-span-3">
            <button type="submit" disabled={isPending} className="btn-primary !py-3 text-xs">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar invitación"}
            </button>
          </div>
        </form>
      )}

      {success && <p className="mb-4 text-sm text-emerald-700">{success}</p>}
      {!showForm && error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      <div className="overflow-x-auto rounded-sm border border-navy/10 bg-cream shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-widest2 text-navy/50">
              <th className="px-4 py-4">Nombre</th>
              <th className="px-4 py-4">Correo</th>
              <th className="px-4 py-4">Rol</th>
              <th className="px-4 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-navy/5">
                <td className="px-4 py-4 font-medium text-navy">{u.name}</td>
                <td className="px-4 py-4 text-navy/70">{u.email}</td>
                <td className="px-4 py-4">
                  <select
                    className="input-luxe !py-2 text-xs"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4 text-xs">
                    <button
                      onClick={() => handleResendAccess(u)}
                      className="flex items-center gap-1.5 text-navy/60 hover:text-gold-dark"
                      title="Reenviar acceso"
                    >
                      <KeyRound className="h-3.5 w-3.5" /> Reenviar acceso
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-navy/40">
                  No hay usuarios registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ROLE_OPTIONS.map((r) => (
          <div key={r} className="rounded-sm border border-navy/10 bg-cream p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest2 text-gold-dark">
              <ShieldCheck className="h-3.5 w-3.5" /> {USER_ROLE_LABELS[r]}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-navy/60">
              {USER_ROLE_DESCRIPTIONS[r]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
