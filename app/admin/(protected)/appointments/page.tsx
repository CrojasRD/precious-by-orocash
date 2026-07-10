// Firebase imports removed - using empty array as fallback
import { requireRole } from "@/lib/auth/require-role";
import AppointmentsTable from "@/components/admin/AppointmentsTable";
import type { AppointmentWithTransaction } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  await requireRole(["admin", "recepcion"]);
  // TODO: Implement Firestore query for appointments with transactions
  // For now, using empty array as fallback
  const appointments = [] as AppointmentWithTransaction[];

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Gestión de citas</p>
        <h1 className="mt-2 font-serif text-3xl text-navy">
          Citas registradas
        </h1>
      </div>

      <AppointmentsTable initialAppointments={appointments} />
    </div>
  );
}
