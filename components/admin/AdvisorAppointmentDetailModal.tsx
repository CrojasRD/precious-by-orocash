"use client";

import { useState, useTransition } from "react";
import { X, Loader2, FileCheck2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  APPOINTMENT_REASON_LABELS,
  APPOINTMENT_STATUS_LABELS,
  type AppointmentWithValuation,
} from "@/lib/types";
import {
  updateAppointmentAdvisorFields,
  upsertValuationReport,
} from "@/lib/actions/advisor";

const REPORTS_BUCKET = "client-files";

export default function AdvisorAppointmentDetailModal({
  appointment,
  onClose,
  onUpdated,
}: {
  appointment: AppointmentWithValuation;
  onClose: () => void;
  onUpdated: (updated: AppointmentWithValuation) => void;
}) {
  const [itemDescription, setItemDescription] = useState(appointment.item_description ?? "");
  const [advisorNotes, setAdvisorNotes] = useState(appointment.advisor_notes ?? "");

  const [summary, setSummary] = useState(appointment.valuation?.summary ?? "");
  const [estimatedValue, setEstimatedValue] = useState(
    appointment.valuation?.estimated_value?.toString() ?? ""
  );
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(
    appointment.valuation?.report_url ?? null
  );

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateAppointmentAdvisorFields({
          appointmentId: appointment.id,
          itemDescription: itemDescription || null,
          advisorNotes: advisorNotes || null,
        });

        let finalReportUrl = reportUrl;

        if (reportFile) {
          const supabase = createClient();
          const ext = reportFile.name.split(".").pop() || "pdf";
          const path = `${appointment.id}/informe-valoracion-${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from(REPORTS_BUCKET)
            .upload(path, reportFile, { upsert: true });
          if (uploadError) throw new Error(uploadError.message);
          finalReportUrl = path;
        }

        if (finalReportUrl) {
          await upsertValuationReport({
            appointmentId: appointment.id,
            reportUrl: finalReportUrl,
            summary: summary || null,
            estimatedValue: estimatedValue ? Number(estimatedValue) : null,
          });
        }

        onUpdated({
          ...appointment,
          item_description: itemDescription || null,
          advisor_notes: advisorNotes || null,
          valuation: finalReportUrl
            ? {
                id: appointment.valuation?.id ?? "",
                appointment_id: appointment.id,
                report_url: finalReportUrl,
                summary: summary || null,
                estimated_value: estimatedValue ? Number(estimatedValue) : null,
                created_by: appointment.valuation?.created_by ?? null,
                created_at: appointment.valuation?.created_at ?? new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : null,
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
            <p className="eyebrow">Ficha del cliente</p>
            <h2 className="mt-1 font-serif text-2xl text-navy">{appointment.full_name}</h2>
          </div>
          <button onClick={onClose} className="text-navy/50 hover:text-navy">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 px-8 py-6">
          <section className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Celular" value={appointment.phone} />
            <Info label="Correo" value={appointment.email} />
            <Info label="Motivo" value={APPOINTMENT_REASON_LABELS[appointment.appointment_reason]} />
            <Info label="Estado" value={APPOINTMENT_STATUS_LABELS[appointment.appointment_status]} />
            <Info label="Fecha" value={appointment.appointment_date} />
            <Info label="Hora" value={appointment.appointment_time} />
          </section>

          <section>
            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
              Oro / gemas traídos por el cliente
            </label>
            <textarea
              rows={3}
              placeholder="Ej. Cadena de oro 18k, 32g, con dije de esmeralda."
              className="input-luxe resize-none"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </section>

          <section>
            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
              Notas privadas del asesor
            </label>
            <p className="mb-2 text-xs text-navy/40">
              Solo visibles para ti y para administración. El cliente nunca las ve.
            </p>
            <textarea
              rows={3}
              placeholder="Observaciones internas sobre la valoración o el cliente."
              className="input-luxe resize-none"
              value={advisorNotes}
              onChange={(e) => setAdvisorNotes(e.target.value)}
            />
          </section>

          <section className="rounded-sm border border-gold/30 bg-ivory p-6">
            <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest2 text-gold-dark">
              <FileCheck2 className="h-4 w-4" /> Informe de valoración
            </p>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
                  Valor estimado (USD)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="input-luxe"
                  placeholder="1800.00"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
                  Archivo del informe (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="text-xs text-navy/60"
                  onChange={(e) => setReportFile(e.target.files?.[0] ?? null)}
                />
                {reportUrl && !reportFile && (
                  <p className="mt-1 text-[11px] text-navy/40">Ya existe un informe guardado.</p>
                )}
              </div>
            </div>

            <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
              Resumen para el cliente
            </label>
            <textarea
              rows={3}
              placeholder="Resumen breve del resultado de la valoración."
              className="input-luxe resize-none"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </section>

          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-navy/10 px-8 py-6">
          <button onClick={onClose} className="btn-secondary !py-3 text-xs">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={isPending} className="btn-primary !py-3 text-xs">
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
