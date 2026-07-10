import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import AdvisorAppointmentsTable from "@/components/admin/AdvisorAppointmentsTable";
import type { AppointmentWithValuation } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MyAppointmentsPage() {
  // RLS ya restringe la lectura de "appointments" a las citas donde
  // assigned_advisor_id = auth.uid() para el rol asesor, así que este
  // select no necesita un .eq() adicional: Supabase solo devuelve lo
  // permitido por la política.
  await requireRole(["admin", "asesor"]);
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("*, valuation:valuation_reports(*)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (error) {
    console.error(error);
  }

  const appointments = (data ?? []).map((row: any) => ({
    ...row,
    valuation: Array.isArray(row.valuation) ? row.valuation[0] ?? null : row.valuation,
  })) as AppointmentWithValuation[];

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Mis citas</p>
        <h1 className="mt-2 font-serif text-3xl text-navy">Citas asignadas</h1>
        <p className="mt-2 max-w-xl text-sm text-navy/60">
          Ficha del cliente, descripción del oro/gema traído, notas privadas
          e informe de valoración de cada una de tus citas.
        </p>
      </div>

      <AdvisorAppointmentsTable initialAppointments={appointments} />
    </div>
  );
}
