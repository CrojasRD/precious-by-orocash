"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  APPOINTMENT_REASON_LABELS,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  type AppointmentReason,
  type AppointmentStatus,
  type AppointmentWithTransaction,
} from "@/lib/types";
import AppointmentDetailModal from "@/components/admin/AppointmentDetailModal";

type Filters = {
  search: string;
  status: AppointmentStatus | "todas";
  reason: AppointmentReason | "todos";
  transactionType: "compra" | "venta" | "todas";
  dateFrom: string;
  dateTo: string;
};

const defaultFilters: Filters = {
  search: "",
  status: "todas",
  reason: "todos",
  transactionType: "todas",
  dateFrom: "",
  dateTo: "",
};

export default function AppointmentsTable({
  initialAppointments,
}: {
  initialAppointments: AppointmentWithTransaction[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selected, setSelected] = useState<AppointmentWithTransaction | null>(null);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (filters.status !== "todas" && a.appointment_status !== filters.status) return false;
      if (filters.reason !== "todos" && a.appointment_reason !== filters.reason) return false;
      if (
        filters.transactionType !== "todas" &&
        a.transaction?.transaction_type !== filters.transactionType
      )
        return false;
      if (filters.dateFrom && a.appointment_date < filters.dateFrom) return false;
      if (filters.dateTo && a.appointment_date > filters.dateTo) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${a.full_name} ${a.identification_number} ${a.email} ${a.phone}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [appointments, filters]);

  function handleUpdated(updated: AppointmentWithTransaction) {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(null);
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 gap-4 rounded-sm border border-navy/10 bg-cream p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, correo o celular"
            className="input-luxe pl-9"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>

        <select
          className="input-luxe"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as Filters["status"] }))}
        >
          <option value="todas">Todos los estados</option>
          {Object.entries(APPOINTMENT_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <select
          className="input-luxe"
          value={filters.reason}
          onChange={(e) => setFilters((f) => ({ ...f, reason: e.target.value as Filters["reason"] }))}
        >
          <option value="todos">Todos los motivos</option>
          {Object.entries(APPOINTMENT_REASON_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <select
          className="input-luxe"
          value={filters.transactionType}
          onChange={(e) => setFilters((f) => ({ ...f, transactionType: e.target.value as Filters["transactionType"] }))}
        >
          <option value="todas">Toda transacción</option>
          <option value="compra">Compra</option>
          <option value="venta">Venta</option>
        </select>

        <div className="flex gap-2">
          <input
            type="date"
            className="input-luxe"
            value={filters.dateFrom}
            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
          />
          <input
            type="date"
            className="input-luxe"
            value={filters.dateTo}
            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
          />
        </div>
      </div>

      <p className="mb-3 text-xs uppercase tracking-widest2 text-navy/50">
        {filtered.length} cita(s) encontradas
      </p>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-sm border border-navy/10 bg-cream shadow-soft">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-widest2 text-navy/50">
              <th className="px-4 py-4">Fecha</th>
              <th className="px-4 py-4">Hora</th>
              <th className="px-4 py-4">Cliente</th>
              <th className="px-4 py-4">Cédula</th>
              <th className="px-4 py-4">Contacto</th>
              <th className="px-4 py-4">Motivo</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4">Transacción</th>
              <th className="px-4 py-4">Valor</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr
                key={a.id}
                onClick={() => setSelected(a)}
                className="cursor-pointer border-b border-navy/5 transition-colors hover:bg-ivory"
              >
                <td className="px-4 py-4 text-navy/80">{a.appointment_date}</td>
                <td className="px-4 py-4 text-navy/80">{a.appointment_time}</td>
                <td className="px-4 py-4 font-medium text-navy">{a.full_name}</td>
                <td className="px-4 py-4 text-navy/70">{a.identification_number}</td>
                <td className="px-4 py-4 text-navy/70">
                  <div>{a.email}</div>
                  <div className="text-xs text-navy/50">{a.phone}</div>
                </td>
                <td className="px-4 py-4 text-navy/70">
                  {APPOINTMENT_REASON_LABELS[a.appointment_reason]}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${APPOINTMENT_STATUS_COLORS[a.appointment_status]}`}
                  >
                    {APPOINTMENT_STATUS_LABELS[a.appointment_status]}
                  </span>
                </td>
                <td className="px-4 py-4 text-navy/70">
                  {a.transaction?.transaction_completed
                    ? a.transaction.transaction_type === "compra"
                      ? "Compra"
                      : "Venta"
                    : "—"}
                </td>
                <td className="px-4 py-4 text-navy/70">
                  {a.transaction?.transaction_value
                    ? `$${a.transaction.transaction_value.toLocaleString("es-EC")}`
                    : "—"}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-navy/40">
                  No se encontraron citas con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <AppointmentDetailModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
