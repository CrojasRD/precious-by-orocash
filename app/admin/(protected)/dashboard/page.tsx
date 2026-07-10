// Firebase imports removed - using default metrics as fallback
import { requireRole } from "@/lib/auth/require-role";
import MetricsCards from "@/components/admin/MetricsCards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireRole(["admin"]);
  // TODO: Implement Firestore query for appointment_metrics
  // For now, using default metrics as fallback
  const metrics = {
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
