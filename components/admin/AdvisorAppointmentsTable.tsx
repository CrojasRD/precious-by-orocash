"use client";

import { useMemo, useState } from "react";
import { Search, FileCheck2 } from "lucide-react";
import {
  APPOINTMENT_REASON_LABELS,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  type AppointmentWithValuation,
} from "@/lib/types";
import AdvisorAppointmentDetailModal from "@/components/admin/AdvisorAppointmentDetailModal";

export default function AdvisorAppointmentsTable({
  initialAppointments,
}: {
  initialAppointments: AppointmentWithValuation[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AppointmentWithValuation | null>(null);

  const filtered = useMemo(() => {
    if (!search) return appointments;
    const q = search.toLowerCase();
    return appointments.filter((a) =>
      `${a.fullName} ${a.identificationNumber} ${a.email}`.toLowerCase().includes(q)
    );
  }, [appointments, search]);

  function handleUpdated(updated: AppointmentWithValuation) {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(null);
  }

  return (
    <div>
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
        <input
          type="text"
          placeholder="Buscar por nombre, cédula o correo"
          className="input-luxe pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="mb-3 text-xs uppercase tracking-widest2 text-navy/50">
        {filtered.length} cita(s) asignada(s)
      </p>

      <div className="overflow-x-auto rounded-sm border border-navy/10 bg-cream shadow-soft">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-widest2 text-navy/50">
              <th className="px-4 py-4">Fecha</th>
              <th className="px-4 py-4">Hora</th>
              <th className="px-4 py-4">Cliente</th>
              <th className="px-4 py-4">Motivo</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4">Informe</th>
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
                  {a.valuation ? (
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <FileCheck2 className="h-3.5 w-3.5" /> Generado
                    </span>
                  ) : (
                    "Pendiente"
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy/40">
                  No tienes citas asignadas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <AdvisorAppointmentDetailModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
