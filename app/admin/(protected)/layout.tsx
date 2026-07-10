import { redirect } from "next/navigation";
// TODO: Implement Firebase Auth session and Firestore profile lookup
// For now, we'll use middleware-based auth
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Replace with Firebase Auth session verification
  // const session = await getServerSession();
  // if (!session) redirect("/admin/login");

  // TODO: Replace with Firestore query for user profile
  // const profile = await db.collection("users").doc(session.user.id).get();
  // if (profile.role === "viewer") redirect("/portal");

  // Temporary: Use middleware for auth, allow render
  const profile = {
    name: "Administrador",
    role: "admin"
  };

  return (
    <div className="flex min-h-screen bg-ivory">
      <AdminSidebar
        userName={profile?.name ?? session.user.email ?? "Administrador"}
        userRole={profile?.role ?? "editor"}
      />
      <main className="flex-1 overflow-x-hidden px-6 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
