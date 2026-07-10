import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PortalDashboard from "@/components/portal/PortalDashboard";
import type { AppointmentWithValuation, ClientDocument } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/portal/login");

  // RLS restringe "appointments" a las filas cuyo email coincide con
  // el del usuario autenticado cuando su rol es "viewer".
  const { data: appointmentsData, error } = await supabase
    .from("appointments")
    .select("*, valuation:valuation_reports(*)")
    .order("appointment_date", { ascending: false });

  if (error) {
    console.error(error);
  }

  const appointments = (appointmentsData ?? []).map((row: any) => ({
    ...row,
    valuation: Array.isArray(row.valuation) ? row.valuation[0] ?? null : row.valuation,
  })) as AppointmentWithValuation[];

  const appointmentIds = appointments.map((a) => a.id);

  let documents: ClientDocument[] = [];
  if (appointmentIds.length > 0) {
    const { data: docsData } = await supabase
      .from("client_documents")
      .select("*")
      .in("appointment_id", appointmentIds)
      .order("created_at", { ascending: false });
    documents = (docsData ?? []) as ClientDocument[];
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
