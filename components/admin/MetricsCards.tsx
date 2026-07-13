type Metrics = {
  total_appointments: number;
  pending_count: number;
  confirmed_count: number;
  attended_count: number;
  no_show_count: number;
  cancelled_count: number;
  transactions_count: number;
  total_purchases: number;
  total_sales: number;
  total_value: number;
};

function formatUSD(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MetricsCards({ metrics }: { metrics: Metrics }) {
  const conversionRate =
    metrics.total_appointments > 0
      ? (metrics.transactions_count / metrics.total_appointments) * 100
      : 0;

  const cards = [
    { label: "Total de citas", value: metrics.total_appointments },
    { label: "Pendientes", value: metrics.pending_count },
    { label: "Confirmadas", value: metrics.confirmed_count },
    { label: "Atendidas", value: metrics.attended_count },
    { label: "Canceladas", value: metrics.cancelled_count },
    { label: "Con transacción", value: metrics.transactions_count },
  ];

  const financials = [
    { label: "Total en compras", value: formatUSD(metrics.total_purchases) },
    { label: "Total en ventas", value: formatUSD(metrics.total_sales) },
    { label: "Valor total generado", value: formatUSD(metrics.total_value) },
    { label: "Tasa de conversión", value: `${conversionRate.toFixed(1)}%` },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-sm border border-navy/10 bg-cream p-5 shadow-soft"
          >
            <p className="text-2xl font-serif text-navy">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest2 text-navy/50">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {financials.map((f) => (
          <div
            key={f.label}
            className="rounded-sm border border-gold/30 bg-navy p-6 text-cream shadow-soft"
          >
            <p className="text-2xl font-serif text-gold-light">{f.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest2 text-cream/60">
              {f.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
