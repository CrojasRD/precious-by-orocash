import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import AppointmentsTable from "@/components/admin/AppointmentsTable";
import type { AppointmentWithTransaction } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  await requireRole(["admin", "recepcion"]);
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("*, transaction:transactions(*)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (error) {
    console.error(error);
  }

  const appointments = (data ?? []).map((row: any) => ({
    ...row,
    transaction: Array.isArray(row.transaction)
      ? row.transaction[0] ?? null
      : row.transaction,
  })) as AppointmentWithTransaction[];

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
