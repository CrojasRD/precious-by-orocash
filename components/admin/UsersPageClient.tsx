"use client";

import { useEffect } from "react";
import { trackUsersListView } from "@/lib/gtm/events";

const USERS = [
  {
    id: "1",
    name: "Editor",
    email: "editor@preciousbyorocash.com",
    role: "editor",
  },
  {
    id: "2",
    name: "Admin",
    email: "admin@preciousbyorocash.com",
    role: "admin",
  },
];

export default function UsersPageClient() {
  useEffect(() => {
    trackUsersListView(USERS.length);
  }, []);

  return (
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
          {USERS.map((user) => (
            <tr key={user.id} className="border-b border-navy/5 hover:bg-ivory">
              <td className="px-4 py-4 font-medium text-navy">{user.name}</td>
              <td className="px-4 py-4 text-navy/70">{user.email}</td>
              <td className="px-4 py-4">
                <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
