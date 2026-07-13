import { requireRole } from "@/lib/auth/require-role";
import MetricsCards from "@/components/admin/MetricsCards";
import { db } from "@/lib/firebase/admin-config";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireRole(["admin"]);

  let metrics = {
    total_appointments: 0,
    pending_count: 0,
    confirmed_count: 0,
    attended_count: 0,
    no_show_count: 0,
    cancelled_count: 0,
    transactions_count: 0,
    total_purchases: 0,
    total_sales: 0,
    total_value: 0,
  };

  try {
    // Fetch all appointments
    try {
      const appointmentsSnapshot = await db().collection("appointments").get();
      const appointments = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      metrics.total_appointments = appointments.length;
      metrics.pending_count = appointments.filter(
        (a) => a.appointmentStatus === "pendiente"
      ).length;
      metrics.confirmed_count = appointments.filter(
        (a) => a.appointmentStatus === "confirmada"
      ).length;
      metrics.attended_count = appointments.filter(
        (a) => a.appointmentStatus === "atendida"
      ).length;
      metrics.no_show_count = appointments.filter(
        (a) => a.appointmentStatus === "no_asistio"
      ).length;
      metrics.cancelled_count = appointments.filter(
        (a) => a.appointmentStatus === "cancelada"
      ).length;
    } catch (appointmentError) {
      console.error("Error fetching appointments:", appointmentError);
    }

    // Fetch all transactions
    try {
      const transactionsSnapshot = await db().collection("transactions").get();
      const transactions = transactionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      metrics.transactions_count = transactions.filter(
        (t) => t.transactionCompleted
      ).length;
      metrics.total_purchases = transactions
        .filter((t) => t.transactionCompleted && t.transactionType === "compra")
        .reduce((sum, t) => sum + (t.transactionValue || 0), 0);
      metrics.total_sales = transactions
        .filter((t) => t.transactionCompleted && t.transactionType === "venta")
        .reduce((sum, t) => sum + (t.transactionValue || 0), 0);
      metrics.total_value =
        metrics.total_purchases + metrics.total_sales;
    } catch (transactionError) {
      console.error("Error fetching transactions:", transactionError);
    }
  } catch (error) {
    console.error("Error in metrics page:", error);
  }

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Resumen</p>
        <h1 className="mt-2 font-serif text-3xl text-navy">
          Métricas de Precious by Orocash
        </h1>
      </div>

      <MetricsCards metrics={metrics} />
    </div>
  );
}
