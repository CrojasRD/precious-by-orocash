"use client";

import { useEffect } from "react";
import { trackDashboardView } from "@/lib/gtm/events";
import MetricsCards from "./MetricsCards";

interface Metrics {
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
}

export default function DashboardMetrics({ metrics }: { metrics: Metrics }) {
  useEffect(() => {
    trackDashboardView();
  }, []);

  return <MetricsCards metrics={metrics} />;
}
