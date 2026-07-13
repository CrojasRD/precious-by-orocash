// Firebase imports removed - using empty array as fallback
import { requireRole } from "@/lib/auth/require-role";
import AdvisorAppointmentsTable from "@/components/admin/AdvisorAppointmentsTable";
import type { AppointmentWithValuation } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MyAppointmentsPage() {
  // TODO: Implement Firebase Auth and Firestore queries
  // - Get current user from auth context
  // - Query Firestore appointments where assigned_advisor_id = userId
  // - Query valuation_reports collection
  await requireRole(["admin", "asesor"]);

  const appointments = [] as AppointmentWithValuation[];

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
