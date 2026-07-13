"use client";

import { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import {
  APPOINTMENT_REASON_LABELS,
  APPOINTMENT_STATUS_LABELS,
  type AppointmentStatus,
  type AppointmentWithTransaction,
  type TransactionType,
} from "@/lib/types";
import { updateAppointmentStatus, upsertTransaction } from "@/lib/actions/admin";

export default function AppointmentDetailModal({
  appointment,
  onClose,
  onUpdated,
}: {
  appointment: AppointmentWithTransaction;
  onClose: () => void;
  onUpdated: (updated: AppointmentWithTransaction) => void;
}) {
  const [status, setStatus] = useState<AppointmentStatus>(appointment.appointmentStatus);
  const [completed, setCompleted] = useState<boolean>(
    appointment.transaction?.transactionCompleted ?? false
  );
  const [type, setType] = useState<TransactionType | "">(
    appointment.transaction?.transactionType ?? ""
  );
  const [value, setValue] = useState<string>(
    appointment.transaction?.transactionValue?.toString() ?? ""
  );
  const [notes, setNotes] = useState<string>(appointment.transaction?.internalNotes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        if (status !== appointment.appointmentStatus) {
          await updateAppointmentStatus(appointment.id, status);
        }

        await upsertTransaction({
          appointmentId: appointment.id,
          transactionCompleted: completed,
          transactionType: completed ? (type as TransactionType) || null : null,
          transactionValue: completed && value ? Number(value) : null,
          internalNotes: notes || null,
        });

        onUpdated({
          ...appointment,
          appointment_status: status,
          transaction: {
            id: appointment.transaction?.id ?? "",
            appointmentId: appointment.id,
            transactionCompleted: completed,
            transactionType: completed ? (type as TransactionType) || null : null,
            transactionValue: completed && value ? Number(value) : null,
            internalNotes: notes || null,
            createdAt: appointment.transaction?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo guardar.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm bg-cream shadow-soft">
        <div className="flex items-center justify-between border-b border-navy/10 px-8 py-6">
          <div>
            <p className="eyebrow">Detalle de cita</p>
            <h2 className="mt-1 font-serif text-2xl text-navy">{appointment.fullName}</h2>
          </div>
          <button onClick={onClose} className="text-navy/50 hover:text-navy">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 px-8 py-6">
          {/* Datos del cliente */}
          <section className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Cédula" value={appointment.identificationNumber} />
            <Info label="Celular" value={appointment.phone} />
            <Info label="Correo" value={appointment.email} />
            <Info
              label="Motivo"
              value={APPOINTMENT_REASON_LABELS[appointment.appointmentReason]}
            />
            <Info label="Fecha" value={appointment.appointmentDate} />
            <Info label="Hora" value={appointment.appointmentTime} />
            {appointment.additionalComment && (
              <div className="col-span-2">
                <Info label="Comentario del cliente" value={appointment.additionalComment} />
              </div>
            )}
          </section>

          {/* Estado */}
          <section>
            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
              Estado de la cita
            </label>
            <select
              className="input-luxe"
              value={status}
              onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
            >
              {Object.entries(APPOINTMENT_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </section>

          {/* Transacción */}
          <section className="rounded-sm border border-gold/30 bg-ivory p-6">
            <p className="mb-4 text-xs uppercase tracking-widest2 text-gold-dark">
              Registro de transacción
            </p>

            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
              ¿Se realizó transacción?
            </label>
            <div className="mb-5 flex gap-3">
              <button
                type="button"
                onClick={() => setCompleted(true)}
                className={`rounded-sm border px-5 py-2 text-sm ${
                  completed ? "border-navy bg-navy text-cream" : "border-navy/20 text-navy/60"
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => setCompleted(false)}
                className={`rounded-sm border px-5 py-2 text-sm ${
                  !completed ? "border-navy bg-navy text-cream" : "border-navy/20 text-navy/60"
                }`}
              >
                No
              </button>
            </div>

            {completed && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
                    Tipo de transacción
                  </label>
                  <select
                    className="input-luxe"
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                  >
                    <option value="" disabled>Selecciona</option>
                    <option value="compra">Compra</option>
                    <option value="venta">Venta</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
                    Valor (USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="2500.00"
                    className="input-luxe"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
                    Observaciones internas
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ej. Cliente compró cadena de oro 18k."
                    className="input-luxe resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>

          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-navy/10 px-8 py-6">
          <button onClick={onClose} className="btn-secondary !py-3 text-xs">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="btn-primary !py-3 text-xs"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest2 text-navy/40">{label}</p>
      <p className="mt-1 text-navy">{value}</p>
    </div>
  );
}
