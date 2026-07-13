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
      if (filters.status !== "todas" && a.appointmentStatus !== filters.status) return false;
      if (filters.reason !== "todos" && a.appointmentReason !== filters.reason) return false;
      if (
        filters.transactionType !== "todas" &&
        a.transaction?.transactionType !== filters.transactionType
      )
        return false;
      if (filters.dateFrom && a.appointmentDate < filters.dateFrom) return false;
      if (filters.dateTo && a.appointmentDate > filters.dateTo) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${a.fullName} ${a.identificationNumber} ${a.email} ${a.phone}`.toLowerCase();
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
      <div className="mb-6 rounded-sm border border-navy/10 bg-cream p-6 shadow-soft space-y-4">
        {/* Fila 1: Búsqueda */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, correo o celular"
            className="input-luxe w-full pl-9"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>

        {/* Fila 2: Selectores */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

          <div></div>
        </div>

        {/* Fila 3: Fechas */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-navy/60 mb-1">Desde</label>
            <input
              type="date"
              className="input-luxe w-full"
              value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest2 text-navy/60 mb-1">Hasta</label>
            <input
              type="date"
              className="input-luxe w-full"
              value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
            />
          </div>
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
                <td className="px-4 py-4 text-navy/80">{a.appointmentDate}</td>
                <td className="px-4 py-4 text-navy/80">{a.appointmentTime}</td>
                <td className="px-4 py-4 font-medium text-navy">{a.fullName}</td>
                <td className="px-4 py-4 text-navy/70">{a.identificationNumber}</td>
                <td className="px-4 py-4 text-navy/70">
                  <div>{a.email}</div>
                  <div className="text-xs text-navy/50">{a.phone}</div>
                </td>
                <td className="px-4 py-4 text-navy/70">
                  {APPOINTMENT_REASON_LABELS[a.appointmentReason]}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${APPOINTMENT_STATUS_COLORS[a.appointmentStatus]}`}
                  >
                    {APPOINTMENT_STATUS_LABELS[a.appointmentStatus]}
                  </span>
                </td>
                <td className="px-4 py-4 text-navy/70">
                  {a.transaction?.transactionCompleted
                    ? a.transaction.transactionType === "compra"
                      ? "Compra"
                      : "Venta"
                    : "—"}
                </td>
                <td className="px-4 py-4 text-navy/70">
                  {a.transaction?.transactionValue
                    ? `$${a.transaction.transactionValue.toLocaleString("es-EC")}`
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
