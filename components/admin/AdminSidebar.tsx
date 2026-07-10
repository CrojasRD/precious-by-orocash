"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  ClipboardList,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { USER_ROLE_LABELS, type UserRole } from "@/lib/types";

const navItems = [
  { href: "/admin/dashboard", label: "Métricas", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/admin/appointments", label: "Citas", icon: CalendarClock, roles: ["admin", "recepcion"] },
  { href: "/admin/my-appointments", label: "Mis citas", icon: ClipboardList, roles: ["asesor"] },
  { href: "/admin/users", label: "Usuarios", icon: Users, roles: ["admin"] },
  { href: "/admin/settings", label: "Configuración", icon: Settings, roles: ["admin", "editor"] },
];

export default function AdminSidebar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-navy/10 bg-navy text-cream">
      <div className="border-b border-cream/10 px-6 py-8">
        <p className="font-serif text-xl">PRECIOUS</p>
        <p className="text-[10px] uppercase tracking-widest2 text-gold-light">
          Panel de administración
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {visibleItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-colors ${
                active
                  ? "bg-cream/10 text-gold-light"
                  : "text-cream/70 hover:bg-cream/5 hover:text-cream"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream/10 px-6 py-5">
        <p className="truncate text-sm text-cream/90">{userName}</p>
        <p className="text-xs text-gold-light/80">
          {USER_ROLE_LABELS[userRole as UserRole] ?? userRole}
        </p>
        <button
          onClick={handleSignOut}
          className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest2 text-cream/50 transition-colors hover:text-gold-light"
        >
          <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
