import { redirect } from "next/navigation";
// Firebase imports removed - using middleware and context for auth
import PortalDashboard from "@/components/portal/PortalDashboard";
import type { AppointmentWithValuation, ClientDocument } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  // TODO: Implement Firebase Auth session verification
  // const session = await getServerSession();
  // if (!session) redirect("/portal/login");

  // TODO: Implement Firestore query for appointments
  // - Get current user from auth context
  // - Query Firestore appointments where email = user.email and role = "viewer"
  // - Order by appointment_date descending

  const appointments = [] as AppointmentWithValuation[];

  const appointmentIds = appointments.map((a) => a.id);

  let documents: ClientDocument[] = [];
  if (appointmentIds.length > 0) {
    // TODO: Implement Firestore client documents query
    // const { data: docsData } = await supabase
    //   .from("client_documents")
    //   .select("*")
    //   .in("appointment_id", appointmentIds)
    //   .order("created_at", { ascending: false });
    // documents = (docsData ?? []) as ClientDocument[];
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-navy/10 bg-navy px-6 py-6 text-cream md:px-10">
        <p className="font-serif text-xl">PRECIOUS</p>
        <p className="text-[10px] uppercase tracking-widest2 text-gold-light">
          Portal del cliente
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 md:px-10">
        <PortalDashboard appointments={appointments} documents={documents} />
      </main>
    </div>
  );
}
