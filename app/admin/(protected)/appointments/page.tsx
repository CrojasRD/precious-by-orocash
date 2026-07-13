import { requireRole } from "@/lib/auth/require-role";
import AppointmentsTable from "@/components/admin/AppointmentsTable";
import type { AppointmentWithTransaction } from "@/lib/types";
import { db } from "@/lib/firebase/admin-config";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  let appointments: AppointmentWithTransaction[] = [];

  try {
    await requireRole(["admin", "recepcion"]);
    // Fetch appointments from Firestore
    const appointmentsSnapshot = await db()
      .collection("appointments")
      .orderBy("appointmentDate", "desc")
      .get();

    appointments = await Promise.all(
      appointmentsSnapshot.docs.map(async (doc) => {
        const appointmentData = doc.data();

        // Try to fetch transaction if exists
        let transaction = null;
        try {
          const transactionDoc = await db()
            .collection("transactions")
            .doc(doc.id)
            .get();
          if (transactionDoc.exists) {
            transaction = {
              id: transactionDoc.id,
              ...transactionDoc.data(),
            } as any;
          }
        } catch (err) {
          // Transaction doesn't exist, that's ok
        }

        return {
          id: doc.id,
          fullName: appointmentData.fullName || "",
          identificationNumber: appointmentData.identificationNumber || "",
          phone: appointmentData.phone || "",
          email: appointmentData.email || "",
          appointmentReason: (appointmentData.appointmentReason || "otro") as any,
          appointmentDate: appointmentData.appointmentDate || "",
          appointmentTime: appointmentData.appointmentTime || "",
          additionalComment: appointmentData.additionalComment || null,
          appointmentStatus: (appointmentData.appointmentStatus || "pendiente") as any,
          assignedAdvisorId: appointmentData.assignedAdvisorId || null,
          itemDescription: appointmentData.itemDescription || null,
          advisorNotes: appointmentData.advisorNotes || null,
          createdAt: appointmentData.createdAt || "",
          updatedAt: appointmentData.updatedAt || "",
          transaction,
        } as AppointmentWithTransaction;
      })
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }

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
